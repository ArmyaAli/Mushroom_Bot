import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import {MusicStateManager} from "../../util/StateManagement";

const command: Command = {
  name: "stop",
  description: "stops the currently playing song",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    const query = args.join(" ");
    MusicStateManager.musicQueue = [];
    MusicStateManager.playingMusic = false;
    if (!message.member!.voice!.channel) {
      await message.channel.send(
        "You must be in a voice channel to use this command!"
      );
      return;
    }

    const userChannel: VoiceChannel = message.member!.voice.channel;
    await userChannel.leave();

    try {
    } catch (error) {
      console.log(error);
    }
  },
};

export = command;
