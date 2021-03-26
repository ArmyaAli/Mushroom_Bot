import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import MusicManager from "../../util/music-player-util/musicManager";
import { checkVoiceStatus } from "./common";


const command: Command = {
    name: "resume",
    description: "Continues current song in the queue.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (!checkVoiceStatus(client, message)) return;
            const GUILD_ID = message.guild?.id;
            if (GUILD_ID) {
                const player = MusicManager.musicQueue.get(GUILD_ID);
                if (player) {
                    let queue: Queue = await player.Instance.getQueue(message);
                    if (queue == undefined) {
                        message.channel.send('Currently no songs in the queue.');
                    }
                    else if (player.Instance.isPlaying(message)) {
                        message.channel.send('Song is currently playing.');
                    }
                    else {
                        await player.Instance.resume(message);
                        message.channel.send('Continuing song.');
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    },
};

export = command;
