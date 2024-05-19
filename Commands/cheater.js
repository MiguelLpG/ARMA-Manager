module.exports = {
    name: "cheater",
    description: "Respuesta automática para todos los que apelan or uso de hacks.",

    run: (client, message, args) => {
        message.channel.send("**__Apelación denegada.__** \nY no, no revelaremos detalles sobre nuestros métodos de detección o por qué fuiste baneado ya que esto puede disminuir nuestras medidas preventivas y puede permitir a la gente cambiar su método de ataque y potencialmente eludir nuestro sistema.")
    }
}