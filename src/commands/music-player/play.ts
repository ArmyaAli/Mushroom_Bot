import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import { Command } from "../../command";
import { checkVoiceStatus } from "./common";


const command: Command = {
    name: "play",
    description: "Searches youtube for a specified song and plays it. Plays spotify playlists as well.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
    }
};

export default command;
