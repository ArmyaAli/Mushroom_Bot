import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../../command";
import { assignQueue, checkVoiceStatus, onSongFinish } from "./playerAPI";
import { Player } from "./playerState";

const command: Command = {
    name: "skip",
    description: "Skips the currently playing song",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const guildId = message.guild?.id;
        try {
            if (guildId) {

                const player = Player.GuildQueues.get(guildId);
                if (player) {

                    if(player.musicQueue.length === 0) {
                        message.channel.send("There are no songs Queued up!");
                        return;
                    }

                    const connection = await message.member?.voice.channel?.join();

                    if (connection) {
                        const musicQueue = player.musicQueue;
                        const next = musicQueue.shift();
                    
                        if (next) {
                            const video = ytdl(next, { filter: 'audioonly' });
                            const dispatcher = connection.play(video); // first one 
                            player.playingMusic = true;
                            dispatcher?.on("finish", () => onSongFinish(player, connection));
                        }

                    }
                }
            }

        } catch (err) {
            console.error(`${err}`);
        }

    }
};

export default command;


