import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";

const command: Command = {
  name: "play",
  description: "Searches youtube for a specified song and plays it. Plays spotify playlists as well.",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {


    
  },
};

export = command;
