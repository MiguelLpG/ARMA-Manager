const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "forcedata",
    description: "Obten tus estadisticas del servidor.",
    run: (client, message, args, db) => {

        if (!(message.author.id == "DEVELOPER_USERID_HERE")) return;
        
        if (!args[0]) return message.channel.send("Debes introducir una SteamID");

        db.query(`SELECT * FROM armagamingdb.players WHERE playerid = ${args[0]}`, (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }

            if (rows.length === 0) {
                return message.channel.send("La SteamID no se encuentra en la base de datos.");
            }

            let dataCon = JSON.stringify(rows[0]);
            const dataLines = dataCon.split(/,(?=\")/); // Dividir cada dato por líneas

            // Función para dividir el mensaje en partes de menos de 2000 caracteres
            const splitMessage = (content) => {
                const maxLength = 1999;
                const messages = [];
                let currentMessage = "";
                content.forEach((line) => {
                    if (currentMessage.length + line.length + 6 > maxLength) {
                        messages.push(currentMessage);
                        currentMessage = "";
                    }
                    currentMessage += "```" + line.trim() + ",```"; // Agregar cada línea al mensaje
                });
                if (currentMessage.length > 0) {
                    messages.push(currentMessage);
                }
                return messages;
            };

            const messagesToSend = splitMessage(dataLines);

            // Enviar los mensajes
            messagesToSend.forEach((content) => {
                message.channel.send(content);
            });
        });
    }
};
