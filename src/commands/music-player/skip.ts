import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";

const command: Command = {
    name: "skip",
    description: "Skips the current song playing in the queue.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (DistubeManager.Instance) {
                if (DistubeManager.musicQueue.length > 0) {
                    const next = DistubeManager.musicQueue.shift()
                    if (next) {
                        DistubeManager.currentSong = next;
                        await DistubeManager.Instance.playSkip(message, next.url)
                        DistubeManager.Instance.getQueue(message).autoplay = true;
                    }
                    return;
                }

                message.channel.send("Currently no songs in the queue. Defaulting to playing the next related song...");
                await DistubeManager.Instance.addRelatedVideo(message)
                DistubeManager.Instance.skip(message)
                
            };
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
