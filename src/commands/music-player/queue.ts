import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import { MusicStateManager } from "../../util/StateManagement";
import { YT_SEARCH_VIDEO } from "./player-util/youtube-scraper";

const command: Command = {
  name: "queue",
  description: "Gets the current Music Queue at that instance in time. At this point in time, this will only return 10 items.",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    const query = args.join(" ");
    let buffer = "";
    try {
      if (!message.member!.voice!.channel) {
        await message.channel.send("You must be in a voice channel to use this command!");
        return;
      }
      if (MusicStateManager.musicQueue.length === 0) {
        await message.channel.send("The Music Queue is empty!");
        return;
      }

      MusicStateManager.musicQueue.forEach((song: YT_SEARCH_VIDEO, index: number) => {
        if (index > 10) return;
        if (song.title)
          buffer += `${index + 1}. ` + song.title + '\n';
      });

      await message.channel.send(buffer);

    } catch (error) {
      console.log(error);
    }
  },
};

export = command;
