import { Client, Message } from "discord.js";
import { Command } from "../../command";
import { MusicStateManager } from "../../util/StateManagement";

const command: Command = {
    name: "song",
    description: "Gets the current song playing in the queue!",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            const query = args.join(" ");
            if (!message.member!.voice!.channel) {
                await message.channel.send("You must be in a voice channel to use this command!");
                return;
            }

            if (!MusicStateManager.playingMusic) {
                await message.channel.send("Nothing is playing right now.");
                return;
            }

            await message.channel.send(`Current song is: ${MusicStateManager.currentSong!.title} @ link: ${MusicStateManager.currentSong!.url}`);

        } catch (error) {
            console.log(error);
        }
    },
};

export = command;