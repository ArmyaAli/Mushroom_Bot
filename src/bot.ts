import Discord, { Message, TextChannel, VoiceState } from "discord.js";
import path from "path";
import config, { readCommandsRecursive } from "./botconfig";
import { Command } from "./command";
import MusicManager from "./util/music-player-util/musicManager";

const client: Discord.Client = new Discord.Client();
const commands: Discord.Collection<string, Command> = new Discord.Collection();
const commandContext = path.join(__dirname, "commands");
let latestMessage: Message | null = null
let commandFiles: string[] = [];

client.once("ready", async () => {
    readCommandsRecursive(commandContext, commandFiles);
    commandFiles = commandFiles.filter((fileName) => fileName.endsWith(".ts") || fileName.endsWith(".js"));
    for (const filePath of commandFiles) {
        const command = require(filePath);
        commands.set(command.name, command);
    }
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user!.tag}!`);
});

client.on("message", async (message: Message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command: string = args.shift()!.toLowerCase();
    latestMessage = message;

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


});

// sends a welcome message if a user joins
client.on("guildMemberAdd", (member) => {
    const channel = member.guild.channels.cache.find(
        (ch) => ch.id == `143853351103102976`
    );
    if (!channel) return;
    (channel as TextChannel).send(
        "Welcome to the Mushroom Cave" + " " + member.displayName + "!"
    );
});

client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
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
});

client.login(config.token).catch(error => {
    console.log(`Error occured during login: ${error}`);

    process.exit();
});
