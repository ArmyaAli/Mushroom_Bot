import { Client, Message, MessageEmbed } from "discord.js";
import Queue from "distube/typings/Queue";
import { Command } from "../../command";
import DistubeManager from "../../util/global-util/distubeManager";

const command: Command = {
    name: "stop",
    description: "Displays the current queue of the DisTube music player.",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        const stoppedPlaylist = new MessageEmbed()
            .setTitle('Stopped adding the playlist')
            .setColor(0xff0000)
        try {
            if (DistubeManager.Instance) {
                DistubeManager.Instance.stop(message);
                DistubeManager.musicQueue = []
                DistubeManager.addingPlaylist = false;
                await message.channel.send(stoppedPlaylist)
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
