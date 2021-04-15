import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import { grabAllSongsFromPlaylist } from '../../util/music-player-util/spotify-API-service';
import { Command } from "../../command";
import MusicManager, { musicPlayer } from "../../util/music-player-util/musicManager";
import { distubeConfig } from "../../botconfig"
import yts from 'yt-search'
import DisTube from "distube";
import { checkVoiceStatus } from "./common";

const finishedPlaylist = new MessageEmbed()
    .setTitle('Spotify Playlist Fully Added!')
    .setColor(0xff0000)

const addSong = async (player: musicPlayer, message: Message, query: string, author: User) => {
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
const addRestOfSongs = async (player: musicPlayer, message: Message, RAW_SONGS: string[], author: User | null) => {
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
            if (MusicManager.musicQueue.has(GUILD_ID)) return;

            MusicManager.musicQueue.set(GUILD_ID,
            {
                    Instance: new DisTube(client, distubeConfig),
                    Queue: [],
                    currentSong: null,
                    firstAuthor: message.author,
                    addingPlaylist: false,
                    message: message
            });

            const thisQueue = MusicManager.musicQueue.get(GUILD_ID)
            
            if (thisQueue)
                MusicManager.registerEvents(thisQueue);
        }
    } catch (err) {
        console.log(`Procedure [assignQueue] in Play command, Error: ${err}`)
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
        let author = message.member?.user

        try {
            const GUILD_ID = message.guild?.id;
            if (GUILD_ID) {
                const player = MusicManager.musicQueue.get(GUILD_ID);
                if (player) {
                    const query = args.join(" ");
                    if (query.startsWith('https://open.spotify.com/playlist')) {
                        if (player.addingPlaylist) {
                            message.channel.send(`There is already a playlist being processed. Wait until it is finished or use !stop and the Queue a new one.`)
                            return;
                        }
                        const LIST_ID: string = query.substr(query.lastIndexOf('/') + 1);
                        const RAW_SONGS: string[] | undefined = await grabAllSongsFromPlaylist(LIST_ID);

                        if (RAW_SONGS) {
                            player.addingPlaylist = true;

                            if (player.Queue.length > 0 || player.Instance.isPlaying) {
                                if (author)
                                    addRestOfSongs(player, message, RAW_SONGS, author);
                                return;
                            }

                            const firstSong = RAW_SONGS.shift()!.split(',').join(" ")
                            const first = await yts(firstSong);
                            const song = first.videos[0].url
                            await player.Instance.play(message, song);

                            if (author)
                                addRestOfSongs(player, message, RAW_SONGS, author);
                            return;
                        } 
                        
                        await message.channel.send(`Failed to add the Spotify Songs to the Music Queue.`);
                        

                    } else if (query.startsWith("https://www.youtube.com/watch")) {
                        // handle logic to handle youtube video links
                    } else {
                        if (player.Instance.isPlaying(message)) {
                            
                            if (author)
                               await addSong(player, message, query, author)
                            
                            if(player.autoplay === true && player.Queue.length > 0) 
                                player.autoplay = player.Instance.toggleAutoplay(message);


                            console.log(`Hit the playing, autoplay ${player.autoplay}`)
                            
                            return;
                        } 
                        
                        player.firstAuthor = message.member?.user;
                        await player.Instance.play(message, query); 
                        
                        if(player.autoplay === false && player.Queue.length === 0) {
                            player.autoplay = player.Instance.toggleAutoplay(message);
                        }
                        
                        console.log(`Hit the not playing, autoplay ${player.autoplay}`)
                    }
                }
            }

        } catch (error) {
            console.log(error)
        }
    },
};

export default command;
