import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { grabAllSongsFromPlaylist } from '../../util/music-player-util/spotify-API-service';
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";


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
                    const LIST_ID = query.substr(query.lastIndexOf('/') + 1);
                    const RAW_SONGS = await grabAllSongsFromPlaylist(LIST_ID);
                    let songs: string[] = [];
                    if (RAW_SONGS) {
                        songs = RAW_SONGS.map((song) => song.title);
                        console.log(songs)
                        // await DistubeManager.Instance.playCustomPlaylist(message, songs);
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
