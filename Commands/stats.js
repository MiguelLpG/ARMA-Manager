const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "stats",
    description: "Obten tus estadisticas del servidor.",
    run: (client, message, args, db) => {
        
        if (!args[0]) return message.channel.send("Debes introducir una SteamID");

        db.query(`SELECT * FROM armagamingdb.players WHERE playerid = ${args[0]}`, (err, rows) => {
            if (err) {
                console.error(err);
                return;
            }

            if (rows.length === 0) {
                return message.channel.send("La SteamID no se encuentra en la base de datos.");
            }

            const datos = rows[0];
            let { uid, name, playerid, cash, bankacc, coplevel, civ_licenses, mediclevel, arrested, aliases, adminlevel, donatorlvl, civ_gear, experiencia, jailtime, arrestreason, oplevel, mafialvl, terrolvl, position, insert_time, blacklist } = datos;
            
            if (parseInt(coplevel) === 0) {coplevel = "No es policía";} else {coplevel = `Sí, de nivel ${coplevel}`;}
            if (parseInt(mediclevel) === 0) {mediclevel = "No es médico";} else {mediclevel = `Sí, de nivel ${mediclevel}`;}
            if (parseInt(donatorlvl) === 0) {donatorlvl = "No es donador";} else {donatorlvl = `Sí`;}
            if (parseInt(adminlevel) === 0) {adminlevel = "No es administrador";} else {adminlevel = `Sí, de nivel ${adminlevel}`;}
            if (parseInt(mafialvl) === 0) {mafialvl = "No es mafia";} else {mafialvl = `Sí`;}
            if (parseInt(terrolvl) === 0) {terrolvl = "No es terrorista";} else {terrolvl = `Sí`;}

            let EmbedStats = new EmbedBuilder()
            .setColor(0xDF342C)
            .setThumbnail("https://media.discordapp.net/attachments/1212402001997070357/1221864961190395934/agc.png?ex=6614216b&is=6601ac6b&hm=0ec7dec0675fab4de9ef16439d9727269948c9b2a1bbd4dd1e5a4c2b1e0ca66f&=&format=webp&quality=lossless")
            .setTitle (`Estadísticas de ${name}`)
            .setDescription("**Estaísticas de jugador:**")
            .addFields(
                { name: "ID", value: `${uid}`, inline: true },
                { name: "Nombre IC", value: `${name}`, inline: true }, 
                { name: "SteamID", value: `${playerid}`, inline: true },
                { name: "Dinero", value: `${cash}`, inline: true },
                { name: "Banco", value: `${bankacc}`, inline: true },
                { name: "Jugador desde:", value: `${insert_time}`, inline: false},
                { name: "¿Policía?", value: `${coplevel}`, inline: true },
                { name: "¿Médico?", value: `${mediclevel}`, inline: true },
                { name: "¿Donador?", value: `${donatorlvl}`, inline: true },
                { name: "¿Mafia?", value: `${mafialvl}`, inline: true },
                { name: "¿Terrorista?", value: `${terrolvl}`, inline: true }
            )
            .setFooter(
                { text: `Solicitado por ${message.author.username}`}
            );
            message.channel.send({ embeds: [EmbedStats] });
        });
    }
};
