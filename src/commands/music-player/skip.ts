import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import MusicManager from "../../util/music-player-util/musicManager";
import { checkVoiceStatus } from "./common";

const command: Command = {
    name: "skip",
    description: "Skips the current song playing in the queue.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (!checkVoiceStatus(client, message)) return;
            const GUILD_ID = message.guild?.id;
            if (GUILD_ID) {
                const player = MusicManager.musicQueue.get(GUILD_ID);
                if (player) {
                    if (player.Queue.length > 0) {
                        const next = player.Queue.shift()
                        if (next) {
                            player.currentSong = next;
                            await player.Instance.playSkip(message, next.url)
                            player.Instance.getQueue(message).autoplay = true;
                        }
                        return;
                    }

                    message.channel.send("Currently no songs in the queue. Defaulting to playing the next related song...");
                    await player.Instance.addRelatedVideo(message)
                    player.Instance.skip(message)

                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
