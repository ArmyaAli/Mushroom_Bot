import { Client, Message } from "discord.js"

export const update = async (client: Client, message: Message, text: string) => {
    if (client.user) {
        if (message.author.id === client.user.id) {
            await message.delete();
        }
    }
    await message.channel.send(text);
}