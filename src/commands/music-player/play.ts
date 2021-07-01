import { Client, Message } from "discord.js";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import { Command } from "../../command";
import { grabAllSongsFromPlaylist } from "./music-player-util/spotify-API-service";
import { assignQueue, checkVoiceStatus, getFirstThreeSearchResults, mapSongTitlesToYoutube, onSongFinish, play, TimeFormat } from "./playerAPI";
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
                    const user = message.author;

                    if (connection) {
                        if (query.includes('open.spotify.com/playlist/')) {
                            const playlistId = query.substr(query.lastIndexOf('/') + 1);
                            const spotifySongs = await grabAllSongsFromPlaylist(playlistId);
                            if (spotifySongs) {
                                const first = spotifySongs.shift();
                                if (first) {
                                    const results = await getFirstThreeSearchResults(first);
                                    if (results) {
                                        await play(player, results, connection, user);
                                        mapSongTitlesToYoutube(player, spotifySongs, user)
                                    }
                                }
                            } else message.channel.send(`Failed to retrieve playlist data from spotify. Try a different playlist.`)
                            return;

                        } else if (query.includes('www.youtube.com/playlist?list=')) {
                            try {
                                const playlistId = query.substr(query.lastIndexOf('=') + 1)
                                const playlist = await ytpl(playlistId);
                                const first = playlist.items.shift();
                                if (first) {
                                    const results = await getFirstThreeSearchResults(first.title);
                                    if (results) {
                                        await play(player, results, connection, user);
                                        mapSongTitlesToYoutube(player, playlist.items.map((item) => item.title), user)
                                    }
                                }
                                return;
                            } catch (err) {
                                message.channel.send(`Failed to retrieve playlist data. Is your playlist private?\nError: ${err}`);
                            }

                        } else {
                            const results = await getFirstThreeSearchResults(query);
                            if (results) {
                                play(player, results, connection, user);
                            }
                            return;
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

