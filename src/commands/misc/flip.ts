import { Client, Message } from "discord.js";
import { Command } from "../../command";

const command: Command = {
    name: "flip",
    description: "Heads or Tails!",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        const test = ["assets/head.jpg", "assets/tails.png"]
        const random = Math.floor(Math.random() * 2)
        try {
            await message.channel.send({ files: [test[random]] })
        } catch (err) {
            console.log(`Error ocurred in FLIP: ${err}`)
        }
    }
}

export = command;