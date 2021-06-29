import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../../command";
import { assignQueue, autoplay, checkVoiceStatus, onSongFinish, TimeFormat } from "./playerAPI";
import { Player } from "./playerState";

const command: Command = {
    name: "queue",
    description: "first 10 songs in the queue",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const guildId = message.guild?.id;
        try {
            if (guildId) {
                const player = Player.GuildQueues.get(guildId);
                if (player) {
                    let qStr = "";
                    if (player.musicQueue.length === 0) {
                        message.channel.send("There are no songs queued up!");
                        return;
                    }

                    for (let i = 0; i < player.musicQueue.length && i < 10; ++i) {
                        qStr += `${i} - \`${player.musicQueue[i]?.title} ~ ${player.musicQueue[i].requestedBy.username}\`\n`;
                    }
                    message.channel.send(qStr);
                }
            }

        } catch (err) {
            console.error(`${err}`);
        }

    }
};

export default command;



