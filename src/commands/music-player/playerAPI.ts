import { Client, Message, VoiceConnection } from "discord.js";
import yts from "yt-search";
import ytdl from "ytdl-core";
import { MusicPlayer, Player } from "./playerState";

export const checkVoiceStatus = (client: Client, message: Message) => {
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
                        message.channel.send("You must be in a voice channel to use this command.");
                        inVoice = false;
                    }
                }
            }
            return inVoice;
        }
    } catch (err) {
        console.log(`Procedure [inVoice] in Play command, Error: ${err}`)
    }
}

export const assignQueue = async (message: Message) => {
    try {
        const guildId = message.guild?.id;

        if (guildId) {
            if (Player.GuildQueues.has(guildId)) return;
            const connection = await message?.member?.voice?.channel?.join()
            if (connection) {
                Player.GuildQueues.set(guildId,
                    {
                        musicQueue: [],
                        playingMusic: false,
                        currentSong: null,
                        message: message,
                    });
            }
        }
    } catch (err) {
        console.log(`Procedure [assignQueue] error: ${err}`)
    }
}

export const getFirstThreeSearchResults = async (query: string) => {
    try {
        const results = await yts(query);
        const firstThree = results.videos.slice(0, 3);
        return firstThree.map((video) => { return { title: video.title, url: video.url } });
    } catch (err) {
        console.error(`Procedure [getFirstThreeSearchResults] error: ${err}`);
    }
}

export const onSongFinish = async (player: MusicPlayer, connection: VoiceConnection) => {
    if (player.musicQueue.length > 0) {
        const next = player.musicQueue.shift();
        if (next) {
            const video = ytdl(next.url, { filter: 'audioonly', dlChunkSize: 0 });
            player.currentSong = await ytdl.getInfo(next.url);
            const volatileDispatcher = connection.play(video);
            console.log('playing next')
            volatileDispatcher?.on('finish', () => onSongFinish(player, connection))
                .on('start', () => {
                    player.message.channel.send(
                        `Playing \`${player.currentSong?.videoDetails.title}\` - \`${TimeFormat(parseInt(player.currentSong?.videoDetails.lengthSeconds ?? "0"))}\`Requested by: ${next.requestedBy ?? 'unknown'}`)
                })
        }
    } else {
        player.message.channel.send(`Finished playing all the songs in the queue`)
        player.playingMusic = false;
    }
}

export const TimeFormat = (seconds: number) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
}
