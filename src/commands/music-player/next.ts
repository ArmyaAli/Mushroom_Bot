import { Client, Guild, GuildMember, Message, MessageEmbed, User } from "discord.js";
import { Command } from "../../command";
import { checkVoiceStatus } from "./playerAPI";
import { Player } from "./playerState";

const command: Command = {
    name: "next",
    description: "Gets the next song in queue",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const guildId = message.guild?.id;
        try {
            if (guildId) {
                const player = Player.GuildQueues.get(guildId);
                if (player) {
                    if(player.musicQueue.length === 0) {
                        message.channel.send(`The queue is empty.`)
                        return;
                    }
                    message.channel.send(`Next song up: \`${player.musicQueue[0].title}\``);
                }
            }
        } catch (err) {
            console.error(`${err}`);
        }

    }
};

export default command;


