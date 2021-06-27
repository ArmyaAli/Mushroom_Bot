import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../../command";
import { assignQueue, checkVoiceStatus, getFirstThreeSearchResults, onSongFinish } from "./playerAPI";
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
                        const musicQueue = player.musicQueue;
                        const results = await getFirstThreeSearchResults(query);

                        if (results) {
                            if (player.playingMusic) {
                                player.musicQueue.push(results[0].url)
                                player.message.channel.send(`Added song to the queue, Q contains ${player.musicQueue.length} songs`);
                                console.log(musicQueue);
                            } else {
                                const song = results[0]
                                const video = ytdl(song.url, { filter: 'audioonly' });
                                const dispatcher = connection.play(video); // first one 
                                player.playingMusic = true;
                                message.channel.send(`Playing: ${song.title}`);
                                dispatcher?.on("finish", () => onSongFinish(player, connection));
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

