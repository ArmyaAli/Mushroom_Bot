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
                let queue: Queue | undefined = await DistubeManager.Instance.getQueue(
                    message
                );
                if (queue.songs.length === 0) {
                    message.channel.send("Currently no songs in the queue.");
                } else {
                    let output = "Next 10 songs in Queue!\n"
                    for(let i = 0; i < 10; ++i) {
                        output +=`**${i+1}**. [${queue.songs[i].name}] <${queue.songs[i].url}> - \`${queue.songs[i].formattedDuration}\`\n`
                    }
                   message.channel.send(output)
                }
            }

        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
