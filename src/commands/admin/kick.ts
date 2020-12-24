import { Client, Message } from 'discord.js';
import { Command } from '../../command';

const command: Command = {
  name: "kick",
  description: "lets an *admin* kick a mentioned user",
  requiredPermissions: ['KICK_MEMBERS'],
  async execute(client: Client, message: Message, args: string[]) {
    const mentionedMembers = await message.mentions.members;
      if(mentionedMembers!.size > 1) {
        message.channel.send('You can only kick one user at a time! Please only mention one person to kick');
      } else {
          try {
            const memberToKick = mentionedMembers!.first();
            if(memberToKick != null) {
              await memberToKick.kick()
              message.channel.send(`Kicked ${memberToKick.displayName}! What a bad shroom!`);
              
            } else {
              message.channel.send(`You cannot kick someone that does not exist within the server!`);
            }
          } catch(error) {
            message.channel.send(`You cannot kick someone with a higher role than you!`);
          }
      
    }
  }
}

export = command;
