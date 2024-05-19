module.exports = {
    name: "adddonor",
    description: "Asigna el nivel de VIP (donatorlvl) a un usuario mencionado.",
    run: (client, message, args, db) => {
        // Verificar si el autor del mensaje es un administrador
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.channel.send("Solo los administradores pueden usar este comando.");
        }

        // Verificar si se menciona a un usuario
        if (!message.mentions.users.size) {
            return message.channel.send("Debes mencionar a un usuario.");
        }

        // Obtener el primer usuario mencionado
        const mentionedUser = message.mentions.users.first();
        
        // Consultar la tabla 'steamidlinked' para verificar si el usuario tiene una SteamID vinculada
        db.query(`SELECT steam_id FROM steamidlinked WHERE discord_id = ?`, [mentionedUser.id], (err, rows) => {
            if (err) {
                console.error('Error al buscar en la base de datos:', err);
                return message.channel.send("Se produjo un error al buscar en la base de datos.");
            }

            // Si se encuentra una asociación de SteamID para el usuario mencionado
            if (rows.length > 0) {
                const steamID = rows[0].steam_id;
                
                // Actualizar la columna 'donatorlvl' en la tabla 'players' para el SteamID correspondiente
                db.query(`UPDATE players SET donatorlvl = 3 WHERE playerid = ?`, [steamID], (err, result) => {
                    if (err) {
                        console.error('Error al actualizar la base de datos:', err);
                        return message.channel.send("Se produjo un error al actualizar la base de datos.");
                    }
                    
                    if (result.affectedRows === 0) {
                        return message.channel.send("No se encontró ningún usuario con la SteamID asociada.");
                    }
                    
                    message.channel.send(`¡Se ha asignado el nivel de VIP al usuario ${mentionedUser}!`);
                });
            } else {
                // Si no se encuentra ninguna asociación de SteamID para el usuario mencionado
                return message.channel.send("El usuario mencionado no ha vinculado su SteamID.");
            }
        });
    }
};
