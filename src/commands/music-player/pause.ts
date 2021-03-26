import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import MusicManager from "../../util/music-player-util/musicManager";
import { checkVoiceStatus } from "./common";

const command: Command = {
    name: "pause",
    description: "Stops current song in the queue.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (!checkVoiceStatus(client, message)) return;
            const GUILD_ID = message.guild?.id;
            if (GUILD_ID) {
                const player = MusicManager.musicQueue.get(GUILD_ID);
                if (player) {
                    let queue: Queue = player.Instance.getQueue(
                        message
                    );
                    if (queue == undefined) {
                        message.channel.send("Currently no songs in the queue.");
                    } else if (player.Instance.isPaused(message)) {
                        message.channel.send("Song is currently paused.");
                    } else {
                        player.Instance.pause(message);
                        message.channel.send("Pausing song.");
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
