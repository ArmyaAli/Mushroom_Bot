import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import { MusicStateManager } from "../../util/StateManagement"
import {
  getURLQueueFromQueries,
  getURLFromQuery,
  YT_SEARCH_VIDEO,
} from "../../util/youtube-scraper";
import ytdl from "ytdl-core";
import ytpl from 'ytpl';
import {
  grabAllSongsFromPlaylist,
  SPOTIFY_PLAYLIST_SONG,
} from "../../util/spotify-API-service";

const batchQueue = async (
  queries: SPOTIFY_PLAYLIST_SONG[],
): Promise<void> => {
  const batch: Array<SPOTIFY_PLAYLIST_SONG> = [];
  if (!queries) return;
  for (let i = 0; i < 5; ++i) {
    const item = queries.shift();
    if (item) {
      batch.push(item);
    }
  }
  try {
    // batch of 5
    console.log(batch);
    await getURLQueueFromQueries(batch, MusicStateManager.musicQueue);
  } catch (err) {
    console.log("Error batching");
  }
};

const spotifyPlay = async (
  message: Message,
  connection: VoiceConnection,
  channel: VoiceChannel,
  playlist: SPOTIFY_PLAYLIST_SONG[],
  playlistSize: number
): Promise<void> => {
  if (!MusicStateManager.musicQueue) {
    channel.leave();
    return;
  }
  const song = MusicStateManager.musicQueue.shift();
  const stream = ytdl(song!.url, { filter: "audioonly", dlChunkSize: 0 }); // set the stream
  const dispatcher = connection.play(stream);
  MusicStateManager.playingMusic = true;
  await message.channel.send(`Now playing ${song!.title}`);
  // this will be scheduled as a microtask
  dispatcher.on("start", async () => {
    while (playlist.length !== 0) {
      await batchQueue(playlist);
      if (playlist.length === 0)
        await message.channel.send(
          `Music Queue constructed with ${playlistSize} songs added!`
        );
    }
  });

  dispatcher.on("finish", async () => {
    try {
      if (MusicStateManager.musicQueue.length === 0) {
        MusicStateManager.playingMusic = false;
        await channel.leave();
        return;
      }
      await spotifyPlay(
        message,
        connection,
        channel,
        playlist,
        playlistSize
      )
    } catch (err) {
      console.log(`Error occured ${err}`);
    }
  });
};

const play = async (
  message: Message,
  connection: VoiceConnection,
  channel: VoiceChannel,
  song: YT_SEARCH_VIDEO
): Promise<void> => {
  const stream = ytdl(song.url, { filter: "audioonly", dlChunkSize: 0 }); // set the stream
  const dispatcher = connection.play(stream);
  MusicStateManager.playingMusic = true;
  await message.channel.send(`Now playing ${song.title}`);
  dispatcher.on("finish", async () => {
    try {
      if (MusicStateManager.musicQueue.length === 0) {
        MusicStateManager.playingMusic = false;
        await channel.leave();
        return;
      }
      const next = MusicStateManager.musicQueue.shift();
      if (next)
        await play(message, connection, channel, next);
    } catch (err) {
      console.log(`Error occured ${err}`);
    }
  });
}

const command: Command = {
  name: "play",
  description: "Searches youtube for a specified song! ",
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
        const playlistSize = playlist!.length;
        if (playlist) {
          await batchQueue(playlist); // batch the first five
          await message.channel.send(
            "Successfully retrieved the playlist... Attempting to create the music queue..."
          );

          await spotifyPlay(
            message,
            connection,
            userChannel,
            playlist,
            playlistSize
          );
        } else {
          await message.channel.send("Playlist could not be found...");
        }
      } else if (query.startsWith("https://www.youtube.com/playlist/")) {
        // TO DO
        // // check if its a youtube playlist
        // const playlist = await ytpl(query, { pages: Infinity });
        // console.log(playlist.items);
        // // while (playlist.continuation != null) {
        // //   const next = await ytpl.continueReq(playlist.continuation);
        // //   console.log(next.items);
        // // }
      } else {
        // if its a search query
        const song = await getURLFromQuery(query);
        if (song) {
          if (!MusicStateManager.playingMusic) {
            await play(message, connection, userChannel, song);
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
