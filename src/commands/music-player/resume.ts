import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import DistubeManager from "../../util/distubeManager";


const command: Command = {
  name: "resume",
  description: "Continues current song in the queue",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    try {
      await DistubeManager.Instance?.resume(message);
    } catch(error) {
      console.log(error)
    }
  },
};

export = command;
