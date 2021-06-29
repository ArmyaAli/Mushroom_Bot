
import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../../command";
import { assignQueue, autoplay, checkVoiceStatus, onSongFinish, TimeFormat } from "./playerAPI";
import { Player } from "./playerState";

const command: Command = {
    name: "auto",
    description: "toggles autoplay on and off",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const guildId = message.guild?.id;
        try {
            if (guildId) {
                const player = Player.GuildQueues.get(guildId);
                if (player) {
                  player.autoplay = !player.autoplay;
                  message.channel.send(`Autoplay is now ${player.autoplay ? 'enabled' : 'disabled'}`) 
                }
            }
        } catch (err) {
            console.error(`${err}`);
        }

    }
};

export default command;