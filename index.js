const { Client, EmbedBuilder, Collection } = require("discord.js")
const client = new Client({ intents: [3276799] })
const fs = require("fs")
const config = require("./config.json")
let { createConnection } = require("mysql")

var db = createConnection({
    host: config.mysql_host,
    user: config.mysql_user,
    port: config.mysql_port,
    database: config.mysql_database,
    password: config.mysql_passwd
})

db.connect();

/*-------------------------------------COMMAND HANDLER------------------------------------*/
client.commands = new Collection()

const archivos = fs.readdirSync("./Commands").filter((f) => f.endsWith(".js"))

for(arx of archivos) {
    const comando = require("./Commands/" + arx)
    client.commands.set(comando.name, comando)
}
/*------------------------------------FIN DEL COMMAND HANDLER--------------------------------*/

/*----------------------------------EVENT HANDLER-----------------------------------------*/
const Interaction = fs.readdirSync("./Events/Interactions").filter((f) => f.endsWith(".js"))
const Message = fs.readdirSync("./Events/Messages").filter((f) => f.endsWith(".js"))

fs.readdirSync("./Events").forEach(subcarpeta => {
    const evento = fs.readdirSync(`./Events/${subcarpeta}/`).filter((f) => f.endsWith(".js"))
    for ( const file of evento ){
        const event = require(`./Events/${subcarpeta}/${file}`)
        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => event.execute(client,...args, db))
        }
    } 
})

const Interacciones = Number(Interaction.length)
const Mensajes = Number(Message.length)
const Todo = Interacciones + Mensajes;

client.setMaxListeners(Todo)

/*------------------------------FIN DEL EVENT HANDLER-------------------------------------------------*/


client.on("ready", () => {
    console.log(config.bot_ready_cmd_msg)
})

client.login(config.token)