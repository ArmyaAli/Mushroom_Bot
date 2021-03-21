import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import { grabAllSongsFromPlaylist } from '../../util/music-player-util/spotify-API-service';
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";
import yts from 'yt-search'

const finishedPlaylist = new MessageEmbed()
    .setTitle('Spotify Playlist Fully Added!')
    .setColor(0xff0000)

const addSong = async (message: Message, query: string, author: User | null) => {
    if (DistubeManager.Instance) {
        const searchResult = await yts(query);
        const songTitle = searchResult.videos[0].title
        const songLink = searchResult.videos[0].url
        DistubeManager.musicQueue.push({ name: songTitle, url: songLink, requestedBy: author})
        message.channel.send(
            `Adding \`${songTitle}\` to the Queue\nRequested by: ${author}`
        )
    }
}
/* Ads the rest of the song to the distube queue */
const addRestOfSongs = async (message: Message, RAW_SONGS: string[],  author: User | null) => {
    if (DistubeManager.Instance) {
        
        for (let i = 0; i < RAW_SONGS.length; ++i) {
            if(!DistubeManager.addingPlaylist) break;
            const name = RAW_SONGS[i].split(',')[0]
            const artist = RAW_SONGS[i].split(',')[1]
            const query = await yts(name + " " + artist);
            DistubeManager.musicQueue.push({ name: name, artist: artist, url: query.videos[0].url, requestedBy: author})
        }

        if(!DistubeManager.addingPlaylist) {
            DistubeManager.musicQueue = []   
            return;
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
        let author = null

        if(message.member) 
            author = message.member.user

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
                        DistubeManager.addingPlaylist = true;
                        if (DistubeManager.musicQueue.length > 0) {
                            addRestOfSongs(message, RAW_SONGS, author);
                            return;
                        }
                        const firstSong = RAW_SONGS.shift()!.split(',').join(" ")
                        const first = await yts(firstSong);
                        const song = first.videos[0].url
                        await DistubeManager.Instance.play(message, song);
                        addRestOfSongs(message, RAW_SONGS, author);
                    } else {
                        await message.channel.send(`Failed to add the Spotify Songs to the Music Queue.`);
                    }
                } else {
                    if (DistubeManager.Instance.isPlaying(message)) {
                        DistubeManager.Instance.getQueue(message).autoplay = false;
                        addSong(message, query, author)
                    } else {
                        if(DistubeManager.Instance.getQueue(message)) {
                            DistubeManager.Instance.getQueue(message).autoplay = true;
                        }
                        DistubeManager.Instance.play(message, query);
                        
                    }

                }
            }
        } catch (error) {
            console.log(error)
        }
    },
};

export = command;
