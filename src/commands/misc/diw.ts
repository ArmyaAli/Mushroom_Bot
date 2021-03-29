import { Client, Message } from "discord.js";
import { Command } from "../../command";

const command: Command = {
    name: "diw",
    description: "Texts to speech, danny is a weeb!",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            await message.channel.send("Danny loves body pillows", {tts: true})
        } catch (err) {
            console.log(`Error ocurred in DIW: ${err}`)
        }
    }
}

export = command;