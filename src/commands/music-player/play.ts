import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import { grabAllSongsFromPlaylist } from '../../util/music-player-util/spotify-API-service';
import { Command } from "../../command";
import MusicManager, { multiGuildQueue } from "../../util/music-player-util/musicManager";
import { distubeConfig } from "../../botconfig"
import yts from 'yt-search'
import DisTube from "distube";

const finishedPlaylist = new MessageEmbed()
    .setTitle('Spotify Playlist Fully Added!')
    .setColor(0xff0000)

const addSong = async (player: multiGuildQueue, message: Message, query: string, author: User | null) => {
    if (player.Instance) {
        const searchResult = await yts(query);
        const songTitle = searchResult.videos[0].title
        const songLink = searchResult.videos[0].url
        player.Queue.push({ name: songTitle, url: songLink, requestedBy: author })
        message.channel.send(
            `Adding \`${songTitle}\` to the Queue\nRequested by: ${author}`
        )
    }
}
/* Ads the rest of the song to the distube queue */
const addRestOfSongs = async (player: multiGuildQueue, message: Message, RAW_SONGS: string[], author: User | null) => {
    if (player.Instance) {

        for (let i = 0; i < RAW_SONGS.length; ++i) {
            if (!player.addingPlaylist) break;
            const name = RAW_SONGS[i].split(',')[0]
            const artist = RAW_SONGS[i].split(',')[1]
            const query = await yts(name + " " + artist);
            player.Queue.push({ name: name, artist: artist, url: query.videos[0].url, requestedBy: author })
        }

        if (!player.addingPlaylist) {
            player.Queue = []
            return;
        }
        
        await message.channel.send(finishedPlaylist);
        player.addingPlaylist = false;
    }
}

const assignQueue = (client: Client, message: Message) => {
    try {
        const GUILD_ID = message.guild?.id;
        if (GUILD_ID) {
            if (!MusicManager.musicQueue.has(GUILD_ID)) {
                MusicManager.musicQueue.set(GUILD_ID, { Instance: new DisTube(client, distubeConfig), Queue: [], currentSong: null, firstAuthor: undefined, addingPlaylist: false, message: message })
                const thisQueue = MusicManager.musicQueue.get(GUILD_ID)
                if (thisQueue)
                    MusicManager.registerEvents(thisQueue);
            }
        }
    } catch (err) {
        console.log(`Procedure [assignQueue] in Play command, Error: ${err}`)
    }
}

const checkVoiceStatus = (client: Client, message: Message) => {
    let inVoice = true;
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
                        inVoice = false
                    }
                }
            }
            return inVoice
        }
    } catch (err) {
        console.log(`Procedure [inVoice] in Play command, Error: ${err}`)
    }
}
const command: Command = {
    name: "play",
    description: "Searches youtube for a specified song and plays it. Plays spotify playlists as well.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        // we need to assign the the command callee a Queue (if they don't have one already)
        assignQueue(client, message);
        console.log(MusicManager.musicQueue)
        let author = null

        if (message.member)
            author = message.member.user
        try {
            const GUILD_ID = message.guild?.id;
            if (GUILD_ID) {
                const player = MusicManager.musicQueue.get(GUILD_ID);
                console.log(player)
                if (player) {
                    const query = args.join(" ");
                    if (query.startsWith('https://open.spotify.com/playlist')) {
                        if (player.addingPlaylist) {
                            message.channel.send(`There is already a playlist being Queued UP. !stop, and then queue up a new one.`)
                            return;
                        }
                        const LIST_ID: string = query.substr(query.lastIndexOf('/') + 1);
                        const RAW_SONGS: string[] | undefined = await grabAllSongsFromPlaylist(LIST_ID);

                        if (RAW_SONGS) {
                            player.addingPlaylist = true;
                            if (player.Queue.length > 0) {
                                addRestOfSongs(player, message, RAW_SONGS, author);
                                return;
                            }
                            const firstSong = RAW_SONGS.shift()!.split(',').join(" ")
                            const first = await yts(firstSong);
                            const song = first.videos[0].url
                            await player.Instance.play(message, song);
                            addRestOfSongs(player, message, RAW_SONGS, author);
                        } else {
                            await message.channel.send(`Failed to add the Spotify Songs to the Music Queue.`);
                        }
                    } else {
                        if (player.Instance.isPlaying(message)) {
                            player.Instance.getQueue(message).autoplay = false;
                            addSong(player, message, query, author)
                        } else {
                            if (player.Instance.getQueue(message)) {
                                player.Instance.getQueue(message).autoplay = true;
                            }
                            player.firstAuthor = message.member?.user;
                            player.Instance.play(message, query);

                        }

                    }
                }
            }

        } catch (error) {
            console.log(error)
        }
    },
};

export = command;
