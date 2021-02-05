import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager from "../../util/distubeManager";

const command: Command = {
  name: "pause",
  description: "Stops current song in the queue.",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    try {
      let queue: Queue | undefined = await DistubeManager.Instance?.getQueue(
        message
      );
      if (queue == undefined) {
        message.channel.send("Currently no songs in the queue.");
      } else if (DistubeManager.Instance?.isPaused) {
        message.channel.send("Song is currently paused.");
      } else {
        await DistubeManager.Instance?.pause(message);
        message.channel.send("Pausing song.");
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export = command;
