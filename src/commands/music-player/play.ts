import { Client, Message, MessageEmbed, StreamDispatcher, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import { grabResultsFromPage } from "../../util/youtube-scraper";
import ytdl from "ytdl-core";
import { grabAllSongsFromPlaylist } from "../../util/spotify-API-service";
import internal from "stream";
// This will complain if you don't provide the right types for each property
const general = "143853351103102977";
const command: Command = {
  name: "play",
  description: "Searches youtube for a specified song! ",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    // check if argument is a valid url
    const query = args.join(" ");
    if(query.startsWith('https://open.spotify.com/playlist/')) {
      await message.channel.send('Spotify playlist detected! Attempting to construct a youtube queue...')
    }
    try {
      const channel: VoiceChannel = client.channels.cache.get(
        general
      ) as VoiceChannel;
      const relatedLink: (string | null)[][] | undefined = await grabResultsFromPage(query);
      if (!relatedLink) throw "Could not find any results";
      const playing = relatedLink[0][1];
      const title = relatedLink[0][0];
      if (playing && channel) {
          message.channel.send(`Now playing: ${title}`);
          const connection: VoiceConnection = await channel.join();
          const stream: internal.Readable = ytdl(playing, { filter: "audioonly" });
          const dispatcher: StreamDispatcher = connection.play(stream);
          dispatcher.on("finish", () => channel.leave());
      }
    } catch (error) {
      message.channel.send(`Error: ${error}`);
    }
  },
};

export = command;
