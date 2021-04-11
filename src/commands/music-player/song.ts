import { Client, Message, } from "discord.js";
import { Command } from "../../command";
import MusicManager from "../../util/music-player-util/musicManager";
import { checkVoiceStatus } from "./common";

const command: Command = {
    name: "song",
    description: "displays the currently playing song",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            if (!checkVoiceStatus(client, message)) return;
            const GUILD_ID = message.guild?.id;
            if (GUILD_ID) {
                const player = MusicManager.musicQueue.get(GUILD_ID);
                if (player) {
                  if(player.Instance.isPlaying(message))
                    message.channel.send(`Currently playing song: \`${player.currentSong?.name}\``);
                  return
                }
                message.channel.send("There are currently no songs being played!");
            }
        } catch (error) {
            console.log(error);
        }
    },
};

export default command;

