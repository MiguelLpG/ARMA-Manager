module.exports = {
    name: "addterror",
    description: "Establece el nivel de EMS de un jugador.",
    run: (client, message, args, db) => {
        
        let autorizados = [
            "DISCORD_USERID_HERE"
        ];

        if (!autorizados.includes(message.author.id)) { return message.channel.send("No tienes permitido utilizar este comando") }

        if (!args[0]) return message.channel.send("Debes introducir una SteamID");

        db.query(`UPDATE armagamingdb.players SET terrolvl = 3 WHERE playerid = ${args[0]}`, (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }

            message.channel.send("Se ha agregado como terrorista a `" + args[0] + "`");
        });
    }
};
