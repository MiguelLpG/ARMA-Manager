module.exports = {
    name: "addmedic",
    description: "Establece el nivel de médico de un jugador.",
    run: (client, message, args, db) => {
        let autorizados = [
            "DISCORD_USERID_HERE"
        ];

        if (!autorizados.includes(message.author.id)) {
            return message.channel.send("No tienes permitido utilizar este comando");
        }

        if (!args[0]) return message.channel.send("Debes introducir una SteamID");

        const steamID = args[0];
        const mediclevel = 3;

        if (isNaN(mediclevel) || mediclevel < 0 || mediclevel > 7) {
            return message.channel.send("El nivel de médico debe ser un número entre 0 y 7.");
        }

        // Consultar si la SteamID está presente en la tabla steamidlinked
        db.query(`SELECT * FROM armagamingdb.steamidlinked WHERE steam_id = '${steamID}'`, (err, linkedRows) => {
            if (err) {
                console.error(err);
                return message.channel.send("Se produjo un error al buscar en la base de datos.");
            }

            if (linkedRows.length === 0) {
                return message.channel.send("La SteamID proporcionada no está vinculada a ninguna cuenta, dile que acuda al [discord de la comunidad](https://discord.gg/y9mpaZxEZF) y que ejecute `!link` junto a su SteamID.");
            }

            // Consultar si la SteamID está presente en la tabla players
            db.query(`SELECT * FROM armagamingdb.players WHERE playerid = '${steamID}'`, (err, playerRows) => {
                if (err) {
                    console.error(err);
                    return message.channel.send("Se produjo un error al buscar en la base de datos.");
                }

                if (playerRows.length === 0) {
                    return message.channel.send("La SteamID solicitada está vinculada en Discord pero nunca ha entrado al servidor, el jugador debe entrar primero al servidor.");
                }

                // La SteamID está presente en ambas tablas, actualizamos el nivel de médico
                db.query(`UPDATE armagamingdb.players SET mediclevel = ${(mediclevel + 1)} WHERE playerid = '${steamID}'`, (err, result) => {
                    if (err) {
                        console.error(err);
                        return message.channel.send("Se produjo un error al actualizar el nivel de médico.");
                    }

                    message.channel.send(`Se le ha agregado la whitelist de **EMS** a la SteamID **${steamID}**.`);
                });
            });
        });
    }
};
