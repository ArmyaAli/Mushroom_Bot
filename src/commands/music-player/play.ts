import { Client, Message, MessageEmbed } from "discord.js";
import { grabAllSongsFromPlaylist } from '../../util/music-player-util/spotify-API-service';
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";
import yts from 'yt-search'

const finishedPlaylist = new MessageEmbed()
      .setTitle('Spotify Playlist Fully Added!')
      .setColor(0xff0000)

const addSong = async (message: Message, query: string) => {
    if (DistubeManager.Instance) {
        const searchResult = await yts(query);
        DistubeManager.musicQueue.push({ name: searchResult.videos[0].title, artist: "", url: searchResult.videos[0].url })
        await message.channel.send(`Adding the song, ${searchResult.videos[0].title} to the Music Queue`);
    }
}
/* Ads the rest of the song to the distube queue */
const addRestOfSongs = async (message: Message, RAW_SONGS: string[]) => {
    if (DistubeManager.Instance) {
        for (let i = 0; i < RAW_SONGS.length; ++i) {
            const name = RAW_SONGS[i].split(',')[0]
            const artist = RAW_SONGS[i].split(',')[1]
            const query = await yts(name + " " + artist);
            DistubeManager.musicQueue.push({ name: name, artist: artist, url: query.videos[0].url })
        }
        await message.channel.send(finishedPlaylist);
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
                        message.channel.send(`There is already a playlist being Queued UP. !stop, and then queue up a new one.`)
                        return;
                    }
                    const LIST_ID: string = query.substr(query.lastIndexOf('/') + 1);
                    const RAW_SONGS: string[] | undefined = await grabAllSongsFromPlaylist(LIST_ID);

                    if (RAW_SONGS) {
                        finishedPlaylist.setDescription(`Added a total of ${RAW_SONGS.length} to the Music Queue!`)
                        DistubeManager.addingPlaylist = true;
                        if (DistubeManager.musicQueue.length > 0) {
                            addRestOfSongs(message, RAW_SONGS);
                        } else {
                            const playListLength = RAW_SONGS.length;
                            const firstSong = RAW_SONGS.shift()!.split(',').join(" ")
                            const first = await yts(firstSong);
                            // play the queue
                            const song = first.videos[0].url
                            await DistubeManager.Instance.play(message, song);
                            addRestOfSongs(message, RAW_SONGS);
                        }
                    } else {
                        await message.channel.send(`Failed to add the Spotify Songs to the Music Queue.`);
                    }
                } else {
                    if (DistubeManager.Instance.isPlaying(message)) {
                        await addSong(message, query)
                    } else {
                        await DistubeManager.Instance.play(message, query);
                    }

                }
            }
        } catch (error) {
            console.log(error)
        }
    },
};

export = command;
