import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import { MusicStateManager } from "../../util/StateManagement"
import {
  getURLQueueFromQueries,
  getURLFromQuery,
  YT_SEARCH_VIDEO,
} from "./player-util/youtube-scraper";
import ytdl from "ytdl-core";
import ytpl from 'ytpl';
import {
  grabAllSongsFromPlaylist,
  SPOTIFY_PLAYLIST_SONG,
} from "./player-util/spotify-API-service";
import { update } from "../../util/messageHandler";
import { batchQueue } from "./player-util/batch";

const play = async (
  client: Client,
  message: Message,
  connection: VoiceConnection,
  channel: VoiceChannel,
  song: YT_SEARCH_VIDEO,
  playlist?: SPOTIFY_PLAYLIST_SONG[]
): Promise<void> => {
  const LEAVE_TIMEOUT = 30000;
  const stream = ytdl(song.url, { filter: "audioonly", dlChunkSize: 0 }); // set the stream
  MusicStateManager.dispatcher = connection.play(stream);
  MusicStateManager.playingMusic = true;
  MusicStateManager.currentSong = song;
  update(client, message, `Now playing ${song.title}`)

  const onSongFinish = async () => {
    try {
      if (MusicStateManager.musicQueue.length === 0) {
        MusicStateManager.playingMusic = false;
        
        setTimeout(async () => {
          if(!MusicStateManager.playingMusic) {
            update(client, message, "Nothing is playing... Leaving the voice channel!")
            await channel.leave();
          }
        }, LEAVE_TIMEOUT);
        return;
      }
      const next = MusicStateManager.musicQueue.shift();
      MusicStateManager.removeAllListeners("skip");
      if (next)
        await play(client, message, connection, channel, next);
    } catch (err) {
      console.log(`Error occured ${err}`);
    }
  }

  MusicStateManager.on("skip", async (data) => {
    console.log("skip event emitted")
    const stream = ytdl(data.url, { filter: "audioonly", dlChunkSize: 0 }); // set the stream
    MusicStateManager.dispatcher = connection.play(stream);
    await message.channel.send(`Now playing ${data.title}`);
    MusicStateManager.dispatcher.on("finish", onSongFinish);
  });

  if (playlist) {
    MusicStateManager.dispatcher.on("start", async () => {
      while (playlist.length != 0 && !MusicStateManager.clearedQ) {
        await batchQueue(playlist);
      }
      if(MusicStateManager.clearedQ) {
        MusicStateManager.clearedQ = false;
        return;
      }
      await message.channel.send("Music Queue constructed, you may now queue up another playlist if you wish.");
      MusicStateManager.batching = false;
    });
  }

  MusicStateManager.dispatcher.on("finish", onSongFinish);
}

const command: Command = {
  name: "play",
  description: "Searches youtube for a specified song and plays it. Plays spotify playlists as well.",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    const query = args.join(" ");
    try {
      if (!message.member!.voice!.channel) {
        await message.channel.send(
          "You must be in a voice channel to use this command!"
        );
        return;
      }
      const userChannel: VoiceChannel = message.member!.voice.channel;
      const connection: VoiceConnection = await userChannel.join();

      if (query.startsWith("https://open.spotify.com/playlist/")) {
        await message.channel.send("Attempting to grab the playlist...");
        const playListid = query.split("/").pop();
        const playlist = await grabAllSongsFromPlaylist(playListid);

        if (playlist) {
          if(MusicStateManager.batching) {
            await message.channel.send(
              "Still constructing Music Queue from a previous playlist! Please Queue this up after completion."
            );
          } else {
            await batchQueue(playlist); // batch the first five
            update(client, message, "Successfully retrieved the playlist... Attempting to create the music queue...");
            const song = MusicStateManager.musicQueue.shift();
  
            if (song) {
              if (!MusicStateManager.playingMusic) {
                await play(client, message, connection, userChannel, song, playlist);
              } else {
                await message.channel.send(`Playlist added to the music queue!`);
                MusicStateManager.musicQueue.push(song)
              }
            }
          }

        } else {
          await message.channel.send("Playlist could not be found...");
        }
      } else {
        // if its a search query
        const song = await getURLFromQuery(query);
        if (song) {
          if (!MusicStateManager.playingMusic) {
            await play(client, message, connection, userChannel, song);
          } else {
            await message.channel.send(`Song ${song.title} added to the music queue!`);
            MusicStateManager.musicQueue.push(song)
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export = command;
