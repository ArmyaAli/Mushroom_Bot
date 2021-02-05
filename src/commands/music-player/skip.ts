import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager from "../../util/distubeManager";

const command: Command = {
    name: "skip",
    description: "Skips the current song playing in the queue.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (DistubeManager.Instance) {
                let queue: Queue = await DistubeManager.Instance.getQueue(
                    message
                );
                if (queue == undefined) {
                    message.channel.send("Currently no songs in the queue.");
                } else {
                    await DistubeManager.Instance.skip(message);
                    message.channel.send("Skipping song.");
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
