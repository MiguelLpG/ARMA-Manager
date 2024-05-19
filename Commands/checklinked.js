const { EmbedBuilder, User } = require("discord.js");

module.exports = {
    name: "checklinked",
    description: "Busca un usuario vinculado por su ID de Discord o su SteamID.",
    run: async (client, message, args, db) => {
        // Verificar si se proporciona un argumento
        if (!args[0]) {
            return message.channel.send("Debes proporcionar una ID de Discord o una SteamID.");
        }

        let user;
        // Verificar si el argumento es una mención de usuario
        const mentionRegex = /^(?:<@!?)?(\d{17,19})>?$/;
        const match = args[0].match(mentionRegex);
        if (match) {
            const userId = match[1];
            user = await client.users.fetch(userId, false);
        } else {
            // Si no es una mención, asumir que es la ID de Discord
            user = await client.users.fetch(args[0], false);
        }

        // Consultar la base de datos para buscar una coincidencia
        db.query(`SELECT * FROM steamidlinked WHERE discord_id = ? OR steam_id = ?`, [user.id, args[0]], (err, rows) => {
            if (err) {
                console.error('Error al buscar en la base de datos:', err);
                return message.channel.send("Se produjo un error al buscar en la base de datos.");
            }

            // Si se encuentra una coincidencia, devolver el usuario y la SteamID asociada
            if (rows.length > 0) {
                const linkedUser = rows[0];
                message.channel.send(`¡Se ha encontrado una cuenta vinculada para ${user.tag}!`);

                let embedReturn = new EmbedBuilder()
                    .setTitle("Información vinculada")
                    .addFields(
                        { name: "ID de Discord", value: `<@${linkedUser.discord_id}> || ${linkedUser.discord_id}`},
                        { name: "SteamID", value: linkedUser.steam_id }
                    );

                return message.channel.send({ embeds: [embedReturn] });
            } else {
                // Si no se encuentra ninguna coincidencia, informar al usuario
                return message.channel.send("No se encontró ninguna asociación para la ID proporcionada.");
            }
        });
    }
};
