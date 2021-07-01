import { Client, Message, User, VoiceConnection } from "discord.js";
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
                        autoplay: true,
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

export const mapSongTitlesToYoutube = async (player: MusicPlayer, songs: string[], requestedBy: User) => {
    try {
        for (const song of songs) {
            const results = await yts(song);
            const first = results.videos[0];
            player.musicQueue.push({ title: first.title, url: first.url, requestedBy: requestedBy });
        }

        player.message.channel.send(`Finished queuing up the spotify playlist, requested by ${requestedBy}`);
    } catch (err) {
        console.error(`Procedure [getFirstSearchResult] error: ${err}`);
    }
}

export const play = async (player: MusicPlayer, results: { title: string, url: string }[], connection: VoiceConnection, user: User) => {
    if (player.playingMusic) {
        player.musicQueue.push({ title: results[0].title, url: results[0].url, requestedBy: user ?? 'unknown' });
        player.message.channel.send(`Added \`${results[0].title}\` - To the Queue\nRequested by: ${user ?? 'unknown'}`);
    } else {
        const song = results[0]
        const video = await ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 });
        player.currentSong = await ytdl.getInfo(song.url);
        const dispatcher = connection.play(video); // first one 
        player.playingMusic = true;
        dispatcher?.on("finish", () => onSongFinish(player))
            .on('debug', (debug) => console.log(debug))
            .on('error', (error) => console.log(error))
        player.message.channel.send(
            `Playing \`${song.title}\` - \`${TimeFormat(parseInt(player.currentSong?.videoDetails.lengthSeconds ?? "0"))}\n\`Requested by: ${user ?? 'unknown'}`
        )
    }
}


export const onSongFinish = async (player: MusicPlayer) => {
    try {
        if (player.musicQueue.length > 0) {
            const next = player.musicQueue.shift();
            if (next) {
                const connection = await player.message.member?.voice.channel?.join();
                const video = await ytdl(next.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 });
                player.currentSong = await ytdl.getInfo(next.url);
                const volatileDispatcher = connection?.play(video);
                volatileDispatcher?.on('finish', () => onSongFinish(player))
                    .on('debug', (debug) => console.log(debug))
                    .on('error', (error) => console.log(`error callback` + error))
                player.message.channel.send(
                    `Playing \`${player.currentSong?.videoDetails.title}\` - \`${TimeFormat(parseInt(player.currentSong?.videoDetails.lengthSeconds ?? "0"))}\`Requested by: ${next.requestedBy ?? 'unknown'}`)
            }
        } else {
            if (player.autoplay) {
                player.message.channel.send(`Queue is empty! Moving to autoplay the next related song (from Youtube!)`);
                autoplay(player);
            } else {
                player.message.channel.send(`Finshed playing songs in the music queue. Queue is empty!`);
            }
        }
    } catch (err) {
        console.error(`Procedure [onSongFinish] error: ${err}`);
    }
}



export const TimeFormat = (seconds: number) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
}

export const autoplay = async (player: MusicPlayer) => {
    const related = player.currentSong?.related_videos;
    if (related) {
        try {
            const next = "https://www.youtube.com/watch?v=" + related[0].id;
            const connection = await player.message.member?.voice.channel?.join();
            const video = await ytdl(next, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 });
            player.currentSong = await ytdl.getInfo(next);
            const volatileDispatcher = connection?.play(video);
            volatileDispatcher?.on('finish', () => onSongFinish(player))
                .on('debug', (debug) => console.log(debug))
                .on('error', (error) => console.log(`error callback` + error))
            await player.message.channel.send(
                `Playing \`${player.currentSong?.videoDetails.title}\` - \`${TimeFormat(parseInt(player.currentSong?.videoDetails.lengthSeconds ?? "0"))}\`Requested by: ${player.message.author ?? 'unknown'}`)
        } catch(err) {
            console.error(`Procedure [autoplay] error ${err}`)
        }
    }
}