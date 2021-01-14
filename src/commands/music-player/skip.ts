import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import { MusicStateManager } from "../../util/StateManagement";

const command: Command = {
    name: "skip",
    description: "skips the current track in the queue and goes to the next one in line",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        const query = args.join(" ");
        if (!message.member!.voice!.channel) {
            await message.channel.send(
                "You must be in a voice channel to use this command!");
            return;
        }

        if (MusicStateManager.musicQueue.length != 0)
            MusicStateManager.emit("skip", MusicStateManager.musicQueue.shift());
        else
            await message.channel.send("The queue is empty, you cannot skip anymore songs!");

        try {
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
