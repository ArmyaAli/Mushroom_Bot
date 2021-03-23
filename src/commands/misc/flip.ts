import { Client, Message } from "discord.js";
import { Command } from "../../command";

const command: Command = {
  name: "flip",
  description: "Heads or Tails!",
  requiredPermissions: [],
  execute(client: Client, message: Message, args: string[])  {
    const test = ["assets/head.jpg", "assets/tails.png"]
    const random = Math.floor(Math.random() * 2)
    message.channel.send({files: [test[random]]})
  }
}

export = command;