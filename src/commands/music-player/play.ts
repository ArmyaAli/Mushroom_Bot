import {
  Client,
  Message,
  MessageEmbed,
  StreamDispatcher,
  VoiceChannel,
  VoiceConnection,
} from "discord.js";
import { Command } from "../../command";
import {
  getURLFromQuery,
  getURLQueueFromQueries,
  YT_SEARCH_VIDEO,
} from "../../util/youtube-scraper";
import ytdl from "ytdl-core";
import {
  grabAllSongsFromPlaylist,
  SPOTIFY_PLAYLIST_SONG,
} from "../../util/spotify-API-service";
import internal from "stream";

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
      console.log(batch);
    }
  }
  try {
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
        const playListid = query.split("/").pop();
        const playlist = await grabAllSongsFromPlaylist(playListid);
        if(playlist) {
          await batchQueue(playlist, musicQueue); // batch the first five
          const stream = ytdl(musicQueue.shift()!.url, { filter: 'audioonly' }); // set the stream
          let dispatcher = connection.play(stream); // play 

          // as soon as the music starts we start our batching by 5s
          dispatcher.on("start", async () => {
            while(playlist.length > 0) {
              await batchQueue(playlist, musicQueue);
            }
          })
          // on a songg finish we should requeue the next song.. (TODO) dispatcther.on returns a handle to itself
          const play = async () => {
            if(musicQueue.length === 0) {
              userChannel.leave();
              return;
            }
            console.log('I have finished playing a song.!');
            let song = musicQueue.shift()!.url;
            while(!ytdl.validateURL(song)) {
              song = musicQueue.shift()!.url;
            }
            const next = ytdl(song, { filter: 'audioonly' });
            connection.play(next);
          }
          dispatcher.on('finish', play);
          dispatcher.on('error', (err) => {message.channel.send(`error: ${err}`);});
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export = command;
