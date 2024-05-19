module.exports = {
    name: "messageCreate",
    async execute(client, message, db) {
        const prefix = "!"
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLocaleLowerCase()

        if(!message.content.startsWith(prefix)) return;

        const cmd = client.commands.get(command)
        if(cmd) {
            cmd.run(client, message, args, db)
        }
    }
}