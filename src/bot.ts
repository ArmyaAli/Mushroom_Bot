import Discord, { Message, TextChannel, VoiceState } from "discord.js";
import path from "path";
import config, { readCommandsRecursive } from "./botconfig";
import { Command } from "./command";

const client: Discord.Client = new Discord.Client();
const commands: Discord.Collection<string, Command> = new Discord.Collection();
const commandContext = path.join(__dirname, "commands");
let commandFiles: string[] = []; // NEED TO REFACTOR

client.once("ready", async () => {
    try {
        readCommandsRecursive(commandContext, commandFiles);
        commandFiles = commandFiles.filter((fileName) => fileName.endsWith(".ts") || fileName.endsWith(".js"));
        for (const filePath of commandFiles) {
            const command = await import(filePath);
            // ignore non command files 
            if (command.default) {
                commands.set(command.default.name, command.default);
            }
            
        }
    } catch (err) {
        console.log(`Event Proc [client.once("ready")] threw error: ${err}`)
    }
    console.log(`Logged in as ${client.user!.tag}!`);

}).on("message", async (message: Message) => {
    try {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const command: string = args.shift()!.toLowerCase();

        if (!commands.get(command)) {
            message.channel.send("That is an invalid command");
            return;
        }

        if (message.member) {
            if (message.member.hasPermission(commands.get(command)!.requiredPermissions)) {
                commands.get(command)!.execute(client, message, args);
            } else
                message.channel.send("You do not have the required permissions to execute that command!")
        }
    } catch (err) {
        console.log(`Event Proc [client.on("message")] threw error: ${err}`)
    }

});

client.login(config.token).catch(error => {
    console.log(`Error occured during login: ${error}`);
    process.exit();
});
