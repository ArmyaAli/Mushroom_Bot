import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { grabAllSongsFromPlaylist } from '../../util/music-player-util/spotify-API-service';
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";
import yts from 'yt-search'

/* Ads the rest of the song to the distube queue */
const addRestOfSongs = async (message: Message, RAW_SONGS: string[]) => {
    if (DistubeManager.Instance) {

        for (let i = 0; i < RAW_SONGS.length; ++i) {
            const rawsong = RAW_SONGS[i]
            if (!rawsong) return
            const name = rawsong!.split(',')[0]
            const artist = rawsong!.split(',')[1]
            const query = await yts(name);
            DistubeManager.currentSpotifyPlaylist.push({name: name, artist: artist, url: query.videos[0].url})
        }
        await message.channel.send(`Finished adding the spotify playlist`);
        DistubeManager.addingPlaylist = false;
    }
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
                    if (DistubeManager.addingPlaylist) {
                        message.channel.send(`There is already a playlist Queued up. Remove it, and then queue up a new one.`)
                        return;
                    }
                    const LIST_ID: string = query.substr(query.lastIndexOf('/') + 1);
                    const RAW_SONGS: string[] | undefined = await grabAllSongsFromPlaylist(LIST_ID);

                    if (RAW_SONGS) {
                        DistubeManager.addingPlaylist = true;
                        const playListLength = RAW_SONGS.length;
                        const firstSong = RAW_SONGS.shift()!.split(',').join(" ")
                        const first = await yts(firstSong);
                        // play the queue
                        const song = first.videos[0].url
                        if (song) {
                            await DistubeManager.Instance.play(message, song);
                            addRestOfSongs(message, RAW_SONGS);
                        }
                    } else {
                        await message.channel.send(`Failed to add the Spotify Songs to the Music Queue.`);
                    }
                } else {
                    DistubeManager.addingPlaylist = false;
                    await DistubeManager.Instance.play(message, query);
                    DistubeManager.addingPlaylist = true;
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
};

export = command;
