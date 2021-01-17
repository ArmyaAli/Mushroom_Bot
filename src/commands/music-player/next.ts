import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import { MusicStateManager } from "../../util/StateManagement";

const command: Command = {
    name: "next",
    description: "Gets the next song playing in the queue!",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            const query = args.join(" ");
            if (!message.member!.voice!.channel) {
                await message.channel.send("You must be in a voice channel to use this command!");
                return;
            }

            if (MusicStateManager.musicQueue.length === 0) {
                await message.channel.send("There are no songs queued up!");
                return;
            }

            await message.channel.send(`Current song is: ${MusicStateManager.musicQueue[0].title} @ link: ${MusicStateManager.musicQueue[0].url}`);

        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
