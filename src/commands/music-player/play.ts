import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import ytdl from "ytdl-core";
import { Command } from "../../command";
import { checkVoiceStatus, getFirstThreeSearchResults } from "./playerAPI";

const queue: string[] = [];
let playing: boolean = false;
const command: Command = {
    name: "play",
    description: "Searches youtube for a specified song and plays it. Plays spotify playlists as well.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const query = args.join(' ');
        try {
            const results = await getFirstThreeSearchResults(query);
            const connection = await message?.member?.voice?.channel?.join();
            if (results) {
                console.log(results)
                if (playing) {
                    queue.push(results[0].url)
                    message.channel.send('Added song to the queue');
                    console.log(queue);
                } else {
                    const video = ytdl(results[0].url)
                    const dispatcher = connection?.play(video); // first one 
                    playing = true;
                    dispatcher?.on("finish", () => {
                        if(queue.length > 0) {
                            const next = queue.pop();
                            if(next) {
                                const video = ytdl(next)
                                connection?.play(video);
                                console.log('playing next')
                            }

                        }
                    })
                }


            }
        } catch (err) {
            console.error(`${err}`);
        }

    }
};

export default command;
