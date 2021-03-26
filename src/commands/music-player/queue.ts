import { Client, Message, MessageFlags, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import MusicManager from "../../util/music-player-util/musicManager";
import { checkVoiceStatus } from "./common";

const command: Command = {
    name: "queue",
    description: "Displays the current queue of the DisTube music player.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {  
            if (!checkVoiceStatus(client, message)) return;
            const GUILD_ID = message.guild?.id;
            if (GUILD_ID) {
                const player = MusicManager.musicQueue.get(GUILD_ID);
                if (player) {
                    if (player.Queue.length > 0) {
                        const queue = player.Queue;
                        let output = "Next songs in Queue! (Up to the next 10)\n"
                        for (let i = 0; i < 10 && i < queue.length; ++i) {
                            output += `**${i + 1}**. ${queue[i].name} by ${queue[i].artist}\n`

                        }
                        output += `There are ${player.Queue.length} total songs in the Queue`
                        message.channel.send(output)
                        return;
                    }
                    await message.channel.send(`Queue is not avaliable yet or does not exist!`)
                }
            }

        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
