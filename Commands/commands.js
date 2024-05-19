const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "commands",
    description: "Lista de comandos disponibles.",

    run: (client, message, args) => {

        let ComandEmbed = new EmbedBuilder()
        .setColor(0xDF342C)
        .setThumbnail("https://media.discordapp.net/attachments/1212402001997070357/1221864961190395934/agc.png?ex=6614216b&is=6601ac6b&hm=0ec7dec0675fab4de9ef16439d9727269948c9b2a1bbd4dd1e5a4c2b1e0ca66f&=&format=webp&quality=lossless")
        .setTitle("Lista de comandos disponibles.")
        .addFields(
            { name: "**Utilidades**", value:"`stats` `link`" },
            { name: "**Gestión Permisos**", value:"`setCopLvl` `addmedic` `addterror` `addmafia` `adddonor`" },
            { name: "**Util Staff**", value: "`cheater` `checkLinked`" },
            { name: "**Villas**", value: "`eval` `forceData`" }
        )

        message.channel.send({ embeds: [ComandEmbed] });    
    }
}