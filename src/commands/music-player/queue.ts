import { Client, Message, MessageFlags, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";

const command: Command = {
    name: "queue",
    description: "Displays the current queue of the DisTube music player.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (DistubeManager.Instance) {
                if(DistubeManager.addingPlaylist) {
                    const queue = DistubeManager.currentSpotifyPlaylist;
                    let output = "Next songs in Queue! (Up to the next 10)\n"
                    for (let i = 0; i < 10 && i < queue.length; ++i) {
                        output += `**${i + 1}**. ${queue[i].name} by ${queue[i].artist}\n`
                        
                    }
                    message.channel.send(output)
                    return;
                }
                let queue: Queue = await DistubeManager.Instance.getQueue(
                    message
                );
                if (queue) {
                    if (queue.songs.length === 0) {
                        message.channel.send("Currently no songs in the queue.");
                    } else {
                        let output = "Next songs in Queue! (Up to the next 10)\n"
                        for (let i = 0; i < 10 && i < queue.songs.length; ++i) {
                            output += `**${i + 1}**. [${queue.songs[i].name}] <${queue.songs[i].url}> - \`${queue.songs[i].formattedDuration}\`\n`
                        }
                        message.channel.send(output)
                    }
                } else {
                    message.channel.send(`Queue is not avaliable yet or does not exist!`)
                }
            }

        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
