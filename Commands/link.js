const SteamID = require("steamid")
module.exports = {
    name: "link",
    description: "Vincula tu cuenta de Discord con tu ID.",
    run: (client, message, args, db) => {
        // Verificar si el usuario ya tiene una cuenta vinculada
        if(!args[0]) return message.channel.send("Debes introducir una SteamID64.");

        let sid = new SteamID(args[0])

        if(!sid.isValidIndividual()) return message.channel.send("La SteamID que has introducido no existe.");

        db.query(`SELECT discord_id FROM steamidlinked WHERE discord_id = ?`, [message.author.id], (err, rows) => {
            if (err) {
                console.error('Error al verificar la cuenta vinculada:', err);
                return message.channel.send("Se produjo un error al verificar tu cuenta vinculada.");
            }

            if (rows.length > 0) {
                return message.channel.send("Ya tienes una cuenta vinculada.");
            }

            // Verificar si la ID de Steam ya está vinculada
            db.query(`SELECT discord_id FROM steamidlinked WHERE steam_id = ?`, [args[0]], (err, rows) => {
                if (err) {
                    console.error('Error al verificar la cuenta vinculada:', err);
                    return message.channel.send("Se produjo un error al verificar la ID de Steam.");
                }

                if (rows.length > 0) {
                    return message.channel.send("La ID de Steam ya está vinculada.");
                }

                // Si no hay una cuenta vinculada y la ID de Steam no está vinculada, vincula la cuenta
                db.query(`INSERT INTO steamidlinked (discord_id, steam_id) VALUES (?, ?)`, [message.author.id, args[0]], (err, result) => {
                    if (err) {
                        console.error('Error al vincular la cuenta:', err);
                        return message.channel.send("Se produjo un error al vincular tu cuenta.");
                    }
                    
                    message.channel.send("Tu cuenta ha sido vinculada exitosamente.");
                });
            });
        });
    }
};
