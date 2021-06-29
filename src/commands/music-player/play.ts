import { Client, Message } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../../command";
import { assignQueue, checkVoiceStatus, getFirstThreeSearchResults, onSongFinish, TimeFormat } from "./playerAPI";
import { Player } from "./playerState";

const command: Command = {
    name: "play",
    description: "Searches youtube for a specified song and plays it. Plays spotify playlists as well.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const query = args.join(' ');
        const guildId = message.guild?.id;
        await assignQueue(message);
        try {
            if (guildId) {
                const player = Player.GuildQueues.get(guildId);
                if (player) {
                    const connection = await message.member?.voice.channel?.join();
                    if (connection) {
                        const results = await getFirstThreeSearchResults(query);
                        if (results) {
                            const user = message.author;
                            if (player.playingMusic) {
                                player.musicQueue.push({ title: results[0].title, url: results[0].url, requestedBy: user ?? 'unknown' });
                                message.channel.send(`Added \`${results[0].title}\` - To the Queue\nRequested by: ${user ?? 'unknown'}`);
                            } else {
                                const song = results[0]
                                const video = await ytdl(song.url, { filter: 'audioonly', dlChunkSize: 0 });
                                player.currentSong = await ytdl.getInfo(song.url);
                                const dispatcher = connection.play(video); // first one 
                                player.playingMusic = true;
                                dispatcher?.on("finish", () => onSongFinish(player))
                                await message.channel.send(
                                    `Playing \`${song.title}\` - \`${TimeFormat(parseInt(player.currentSong?.videoDetails.lengthSeconds ?? "0"))}\n\`Requested by: ${user ?? 'unknown'}`
                                )
                                // .on('start', async () => {
                                //     await message.channel.send(
                                //         `Playing \`${song.title}\` - \`${TimeFormat(parseInt(player.currentSong?.videoDetails.lengthSeconds ?? "0"))}\n\`Requested by: ${user ?? 'unknown'}`
                                //     )
                                // })
                            }
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

