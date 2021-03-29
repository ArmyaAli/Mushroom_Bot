import { Client, Message } from "discord.js";
import { Command } from "../../command";

const command: Command = {
    name: "power",
    description: "TTS",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            await message.channel.send("supa hot fire", {tts: true})
        } catch (err) {
            console.log(`Error ocurred in DIW: ${err}`)
        }
    }
}

export = command;