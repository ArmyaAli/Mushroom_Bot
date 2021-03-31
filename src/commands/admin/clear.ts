import { Client, Message, TextChannel } from 'discord.js';
import { Command } from '../../command';

const command: Command = {
  name: "clear",
  description: "Clear the currently wrote to channel: args: number (how many messages to delete) or 'nuke' (Clears everything in that channel)",
  requiredPermissions: ['MANAGE_CHANNELS'],
  async execute(client: Client, message: Message, args: string[]) {
    try {
      if (args.length > 1 || args.length === 0) {
        await message.channel.send("This command takes ONE arguement and ONLY one arguement");
        return;
      }  else {
        if(args.join() === "nuke") {
          const oldPosition = (message.channel as TextChannel).position;
          const newChannel = await (message.channel as TextChannel).clone();
          await newChannel.setPosition(oldPosition);
          await message.channel.delete();
        } else {
          if(parseInt(args.join()) > 0)
            await (message.channel as TextChannel).bulkDelete(parseInt(args.join()))
          else
            await message.channel.send("How do I delete exactly ZERO messages...");
        }
      }
    } catch (error) {
      message.channel.send(`Error: ${error}`);
    }
  },
};

export default command;

