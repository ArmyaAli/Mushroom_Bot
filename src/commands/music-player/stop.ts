import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager from "../../util/distubeManager";

const command: Command = {
    name: "queue",
    description: "Displays the current queue of the DisTube music player.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (DistubeManager.Instance) {
                let queue: Queue = await DistubeManager.Instance.getQueue(
                    message
                );
                if (queue.songs.length === 0) {
                    message.channel.send("Currently no songs in the queue.");
                } else {
                    DistubeManager.Instance.stop(message);
                    message.channel.send("Stopped the queue!");
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
