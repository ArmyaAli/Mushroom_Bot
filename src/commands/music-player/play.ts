import {
  Client,
  Message,
  VoiceChannel,
  VoiceConnection,
} from "discord.js";
import { Command } from "../../command";
import {
  getURLQueueFromQueries,
  YT_SEARCH_VIDEO,
} from "../../util/youtube-scraper";
import ytdl from "ytdl-core";
import {
  grabAllSongsFromPlaylist,
  SPOTIFY_PLAYLIST_SONG,
} from "../../util/spotify-API-service";

const batchQueue = async (
  queries: SPOTIFY_PLAYLIST_SONG[],
  queue: any[]
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
    await getURLQueueFromQueries(batch, queue);
  } catch (err) {
    console.log("Error batching");
  }
};


const command: Command = {
  name: "play",
  description: "Searches youtube for a specified song! ",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    const query = args.join(" ");
    const musicQueue: YT_SEARCH_VIDEO[] = [];
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
        await message.channel.send(
          "Attempting to grab the playlist..."
        );
        const playListid = query.split("/").pop();
        const playlist = await grabAllSongsFromPlaylist(playListid);
        if (playlist) {
          await batchQueue(playlist, musicQueue); // batch the first five
          await message.channel.send(
            "Successfully retrieved the playlist... Attempting to create the music queue..."
          );

          const play = async (): Promise<void> => {
            if(musicQueue.length === 0) {
              userChannel.leave();
              return
            };
            const song = musicQueue.shift();
            const stream = ytdl(song!.url, { filter: 'audioonly', dlChunkSize: 0 }); // set the stream
            const dispatcher = connection.play(stream);
            await message.channel.send(
              `Now playing ${song!.title}`
            );
            // this will be scheduled as a microtask
            dispatcher.on("start", async () => {
              while(playlist.length !== 0)
                await batchQueue(playlist, musicQueue); // batch the first five
            })
            dispatcher.on("finish", play);
          }
          await play();

          
        } else {
          await message.channel.send('Playlist could not be found...');
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export = command;
