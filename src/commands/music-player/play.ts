import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { grabAllSongsFromPlaylist } from '../../util/music-player-util/spotify-API-service';
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";
import yts from 'yt-search'

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
                        DistubeManager.addingPlaylist = true;
                        for (const song of RAW_SONGS) {
                            const query = await yts(song.split(',').join(" "));
                            const url = query.videos[0].url;
                            await DistubeManager.Instance.play(message, url);
                        }
                        await message.channel.send(`Finished adding the spotify playlist. All ${RAW_SONGS.length} songs are now in Queue!`);
                        DistubeManager.addingPlaylist = false;
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
