import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import { Command } from "../../command";
import { checkVoiceStatus } from "./playerAPI";
import { Player } from "./playerState";

const command: Command = {
    name: "song",
    description: "currently playing song",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const guildId = message.guild?.id;
        try {
            if (guildId) {
                const player = Player.GuildQueues.get(guildId);
                if (player) {
                    if (!player.playingMusic) {
                        message.channel.send("There are no songs playing!");
                        return;
                    }
                    message.channel.send(`Currently playing: \`${player.currentSong?.videoDetails.title}\``);
                }
            }
        } catch (err) {
            console.error(`${err}`);
        }

    }
};

export default command;




