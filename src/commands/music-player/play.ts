import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import DistubeManager from "../../util/distubeManager";


const command: Command = {
  name: "play",
  description: "Searches youtube for a specified song and plays it. Plays spotify playlists as well.",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    try {
      await DistubeManager.Instance?.play(message, args.join(" "));
    } catch(error) {
      console.log(error)
    }
  },
};

export = command;
