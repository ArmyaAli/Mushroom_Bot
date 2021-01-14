import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import { MusicStateManager } from "../../util/StateManagement";

const command: Command = {
    name: "clearq",
    description: "clears the music queue!",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        const query = args.join(" ");
        if (!message.member!.voice!.channel) {
            await message.channel.send("You must be in a voice channel to use this command!");
            return;
        }
        if (MusicStateManager.musicQueue.length !== 0) {
            await message.channel.send("Cleared the Music Queue!");
            MusicStateManager.dispatcher = null;
            MusicStateManager.musicQueue = [];
            MusicStateManager.clearedQ = true;
            MusicStateManager.batching = false; // setting the clearedQ flag to true will stop the batching process
        } else
            await message.channel.send("Music Queue is already empty!");

        try {
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
