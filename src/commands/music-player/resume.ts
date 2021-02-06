import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";


const command: Command = {
    name: "resume",
    description: "Continues current song in the queue.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (DistubeManager.Instance) {
                let queue: Queue = await DistubeManager.Instance.getQueue(message);
                if (queue == undefined) {
                    message.channel.send('Currently no songs in the queue.');
                }
                else if (DistubeManager.Instance.isPlaying(message)) {
                    message.channel.send('Song is currently playing.');
                }
                else {
                    await DistubeManager.Instance.resume(message);
                    message.channel.send('Continuing song.');
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
};

export = command;
