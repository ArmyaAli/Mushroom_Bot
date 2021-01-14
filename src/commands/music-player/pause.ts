import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import { MusicStateManager } from "../../util/StateManagement";

const command: Command = {
  name: "pause",
  description: "pauses the currently playing song",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    const query = args.join(" ");
    if (!message.member!.voice!.channel) {
      await message.channel.send(
        "You must be in a voice channel to use this command!"
      );
      return;
    }
    
    if(MusicStateManager.dispatcher)
        MusicStateManager.dispatcher.pause()

    try {
    } catch (error) {
      console.log(error);
    }
  },
};

export = command;
