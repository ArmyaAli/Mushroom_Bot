import { Client, Message } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../../command";
import { autoplay, checkVoiceStatus, onSongFinish, TimeFormat } from "./playerAPI";
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
                    if (player.musicQueue.length === 0) {
                        if (args.join(' ') === 'auto') {
                            autoplay(player);
                            message.channel.send("Skipping to the next related song recommended by YouTube!");
                            return;
                        }
                        message.channel.send("There are no songs queued up! If you would like to skip to a related song...do !skip auto");
                        return;
                    }
                    const connection = await message.member?.voice.channel?.join();
                    if (connection) {
                        const user = message.author;
                        const musicQueue = player.musicQueue;
                        const next = musicQueue.shift();

                        if (next) {
                            const video = await ytdl(next.url, { filter: 'audioonly', dlChunkSize: 0 });
                            player.currentSong = await ytdl.getInfo(next.url);
                            const dispatcher = connection.play(video); // first one 
                            player.playingMusic = true;
                            dispatcher?.on("finish", () => onSongFinish(player))
                                .on('start', () => {
                                    message.channel.send(`Playing \`${player.currentSong?.videoDetails.title}\` - \`${TimeFormat(parseInt(player.currentSong?.videoDetails.lengthSeconds ?? "0"))}\n\`Requested by: ${user ?? 'unknown'}`);
                                })
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


