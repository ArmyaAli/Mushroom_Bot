import { Client, Message, MessageEmbed } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import MusicManager from "../../util/music-player-util/musicManager";
import { checkVoiceStatus } from "./common";

const command: Command = {
    name: "stop",
    description: "Displays the current queue of the DisTube music player.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        const stoppedPlaylist = new MessageEmbed()
            .setTitle('Stopped adding the playlist')
            .setColor(0xff0000)
        try {
            if (!checkVoiceStatus(client, message)) return;
            const GUILD_ID = message.guild?.id;
            if (GUILD_ID) {
                const player = MusicManager.musicQueue.get(GUILD_ID);
                if (player) {
                    if (player.Instance) {
                        player.Instance.stop(message);
                        MusicManager.musicQueue.delete(GUILD_ID);
                        message.channel.send("Stopped and cleared the Queue. Mushroom ~!!")
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export default command;
