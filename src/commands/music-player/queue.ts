import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import { MusicStateManager } from "../../util/StateManagement";

const command: Command = {
  name: "queue",
  description: "Gets the current Music Queue at that instance in time. At this point in time, this will only return 10 items.",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    const query = args.join(" ");
    let buffer = "";
    if (!message.member!.voice!.channel) {
      await message.channel.send("You must be in a voice channel to use this command!");
      return;
    }

    if(MusicStateManager.musicQueue) {
        for(let i = 0; i < 10; ++i) {
            if(MusicStateManager.musicQueue[i].title)
                buffer += `${i+1}. ` + MusicStateManager.musicQueue[i].title + '\n';
            else
                break;
        }
        await message.channel.send(buffer);
    }

    try {
    } catch (error) {
      console.log(error);
    }
  },
};

export = command;
