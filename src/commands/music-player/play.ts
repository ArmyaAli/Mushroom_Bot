import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { grabAllSongsFromPlaylist } from '../../util/spotify-API-service';
import { Command } from "../../command";
import DistubeManager from "../../util/distubeManager";


const command: Command = {
    name: "play",
    description: "Searches youtube for a specified song and plays it. Plays spotify playlists as well.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            const query = args.join(" ");
            if (query.startsWith('https://open.spotify.com/playlist/37i9dQZF1DWY6tYEFs22tT')) {
                const rawsongs = await grabAllSongsFromPlaylist(query);
                let songs: string[] = []
                if (rawsongs) {
                    songs = rawsongs.map((song) => song.title);
                    await DistubeManager.Instance?.playCustomPlaylist(message, songs);
                }


            } else {
                await DistubeManager.Instance?.play(message, query);
            }

        } catch (error) {
            console.log(error)
        }
    },
};

export = command;
