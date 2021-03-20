import { Client, Message, MessageEmbed } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager, { SongData } from "../../util/global-util/distubeManager";

const shuffledEmbed = new MessageEmbed()
    .setTitle('Shuffled All Songs in the Queue')
    .setColor(0xff0000)

// https://bost.ocks.org/mike/shuffle/
const shuffle = (array: SongData[]) => {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
const command: Command = {
    name: "shuffle",
    description:
        "Shuffles and displays the current queue of the DisTube music player.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (DistubeManager.Instance) {
                if (DistubeManager.addingPlaylist) {
                    if (DistubeManager.musicQueue.length === 0) {
                        message.channel.send("Currently no songs in the queue.");
                        return;
                    }
                    shuffle(DistubeManager.musicQueue);
                    message.channel.send(shuffledEmbed);
                    if (DistubeManager.musicQueue.length > 0) {
                        const queue = DistubeManager.musicQueue;
                        let output = "Next songs in Queue! (Up to the next 10)\n"
                        for (let i = 0; i < 10 && i < queue.length; ++i) {
                            output += `**${i + 1}**. ${queue[i].name} by ${queue[i].artist}\n`

                        }
                        message.channel.send(output)
                    }
                   
                    return;
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
