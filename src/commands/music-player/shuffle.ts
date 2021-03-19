import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager, { SongData } from "../../util/global-util/distubeManager";

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
                if(DistubeManager.addingPlaylist) {
                    shuffle(DistubeManager.musicQueue)
                    return;
                }
                let queue: Queue = await DistubeManager.Instance.getQueue(
                    message
                );
                if (queue.songs.length === 0) {
                    message.channel.send("Currently no songs in the queue.");
                } else {
                    DistubeManager.Instance.shuffle(message);
                    let output = "Next songs in Queue! (Up to the next 10)\n"
                    for(let i = 0; i < 10 && i < queue.songs.length; ++i) {
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
