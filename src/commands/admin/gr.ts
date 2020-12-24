import { Client, Message } from 'discord.js';
import { Command } from '../../command';

const command: Command = {
  name: "gr",
  description: "Gives the argument role to the target server memeber!",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
     
  }
}

export = command;
