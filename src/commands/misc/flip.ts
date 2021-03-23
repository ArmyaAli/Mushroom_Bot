import { Client, Message } from "discord.js";
import { Command } from "../../command";

const command: Command = {
  name: "flip",
  description: "Heads or Tails!",
  requiredPermissions: [],
  execute(client: Client, message: Message, args: string[])  {
    const test = ["Heads", "Tails"]    
    const random = Math.floor(Math.random() * 2)
    console.log(random)
    message.channel.send(test[random])
  }
}

export = command;