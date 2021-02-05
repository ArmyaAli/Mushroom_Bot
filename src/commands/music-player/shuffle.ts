import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager from "../../util/distubeManager";

const command: Command = {
    name: "shuffle",
    description:
        "Shuffles and displays the current queue of the DisTube music player.",
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
                    DistubeManager.Instance.shuffle(message);
                    message.channel.send(
                        "Current queue:\n" +
                        queue!.songs
                            .map(
                                (song, id) =>
                                    `**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration
                                    }\``
                            )
                            .join("\n")
                    );
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
