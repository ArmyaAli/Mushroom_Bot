import Discord, { Message, TextChannel, VoiceState } from "discord.js";
import path from "path";
import config, { readCommandsRecursive } from "./botconfig";
import { Command } from "./command";
import MusicManager from "./util/music-player-util/musicManager";

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

}).on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    try {
        const oldChannel = oldState.channel;
        const oldGuild = oldState.guild;

        /* This will check if a channel in the specific guild that the Specific Music Queue in the map is empty and leaves the voice channel is it becomes empty. Maybe we can improve it in the sense that it does not leave the voice if somebody comes back */
        if (oldChannel && oldGuild) {
            if (oldChannel.members.size === 1) { // if the bot is the only one in the channel
                const toDispose = MusicManager.musicQueue.get(oldGuild.id);
                if (toDispose) {
                    await toDispose.message.channel.send("Empty channel. Leaving in 15 seconds!! Mushroomie ~~");

                    setTimeout(() => {
                        MusicManager.musicQueue.delete(oldGuild.id);
                        oldState.channel?.leave()
                    }, 15000)
                }
            }
        }
    } catch (err) {
        console.log(`Event Proc [client.on("voiceStateUpdate")] threw error: ${err}`)
    }
});

client.login(config.token).catch(error => {
    console.log(`Error occured during login: ${error}`);
    process.exit();
});
