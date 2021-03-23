import Discord, { BitFieldResolvable, Message, PermissionString, TextChannel, VoiceState } from "discord.js";
import path from "path";
import config, { readCommandsRecursive, distubeConfig } from "./botconfig";
import { Command } from "./command";

const client: Discord.Client = new Discord.Client();
const commands: Discord.Collection<string, Command> = new Discord.Collection();
const commandContext = path.join(__dirname, "commands");
let s_message: Message | null = null
let commandFiles: string[] = [];

client.once("ready", async () => {
    /* Set our music player */
    // MusicManager.Instance = new DisTube(client, distubeConfig);
    /* Register music player events */
    // MusicManager.registerEvents();
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
    s_message = message;

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

// client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
//     const oldSize = oldState.channel?.members.size;
//     const newSize = newState.channel?.members.size;
//     const currentChannelId = oldState.channelID;
//     const currentGuild = oldState.guild;
//     if (currentChannelId) {
//         const currentChannel = oldState.guild.channels.cache.get(currentChannelId)
//         if (oldSize && currentGuild.channels.) {
//             if (oldSize <= 1) {
//                 s_message?.channel.send("Empty Voice Channel...Leaving the Voice Channel in 30 seconds...")
//                 setTimeout(() => {
//                     // MusicManager.musicQueue = [];
//                     // MusicManager.firstAuthor = undefined;
//                     // MusicManager.addingPlaylist = false;
//                     // MusicManager.currentSong = null;
//                     oldState.channel?.leave();
//                 }, 30000)
//             }
//         }
//     }

// });

client.login(config.token).catch(error => {
    console.log(`Error occured during login: ${error}`);

    process.exit();
});
