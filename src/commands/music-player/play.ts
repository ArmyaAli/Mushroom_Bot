import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { grabAllSongsFromPlaylist } from '../../util/music-player-util/spotify-API-service';
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";
import yts from 'yt-search'

const grabFirstFive = async (songs: string[]) => {
    const result = []
    for (let i = 0; i < 5; ++i) {
        const song = await yts(songs[i]);
        result.push(song.videos[0].url)
        songs.shift();
    }
    return result;
}
const constructSongUrlArray = async (songs: string[]) => {
    const result = []
    for (const song in songs) {
        const query = await yts(song)
        result.push(query.videos[0].url)
    }
    return result
}
const command: Command = {
    name: "play",
    description: "Searches youtube for a specified song and plays it. Plays spotify playlists as well.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (message.guild) {
                const GUILD_ID = message.guild.id;
                const USER_ID = message.author.id;
                const server = client.guilds.cache.get(GUILD_ID); // Getting the guild.
                if (server) {
                    const member = server.members.cache.get(USER_ID); // Getting the member.
                    if (member) {
                        if (!member.voice.channel) {
                            message.channel.send("You must be in a voice channel to use this command.")
                            return;
                        }
                    }
                }
            }

            if (DistubeManager.Instance) {
                const query = args.join(" ");
                if (query.startsWith('https://open.spotify.com/playlist')) {
                    const LIST_ID: string = query.substr(query.lastIndexOf('/') + 1);
                    const RAW_SONGS: string[] | undefined = await grabAllSongsFromPlaylist(LIST_ID);
                    if (RAW_SONGS) {
                        const YOUTUBE_URLS: string[] = []
                        const firstFive = await grabFirstFive(RAW_SONGS);
                        constructSongUrlArray(RAW_SONGS).then(async (data: string[]) => {
                            await message.channel.send(`Finished Grabbing Playlist. Adding to Queue.`)
                            if (DistubeManager.Instance) {
                                await DistubeManager.Instance.playCustomPlaylist(message, data, {playSkip: false});
                            }
                            console.log(data)
                        })
                        await DistubeManager.Instance.playCustomPlaylist(message, firstFive, {playSkip: false});
                    }
                } else {
                    await DistubeManager.Instance.play(message, query);
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
};

export = command;
