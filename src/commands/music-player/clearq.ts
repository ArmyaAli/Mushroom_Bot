import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../../command";
import { assignQueue, autoplay, checkVoiceStatus, onSongFinish, TimeFormat } from "./playerAPI";
import { Player } from "./playerState";

const command: Command = {
    name: "clearq",
    description: "Clears the queue and stops any playlist adding process",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const guildId = message.guild?.id;
        try {
            if (guildId) {
                const player = Player.GuildQueues.get(guildId);
                if (player) {
                  player.playlistRoutinesCount = 0;
                  player.musicQueue = [];
                  message.channel.send(`Cleared the music queue.`); 
                }
            }
        } catch (err) {
            console.error(`${err}`);
        }

    }
};

export default command;