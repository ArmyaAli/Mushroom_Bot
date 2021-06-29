import { Client, Message } from "discord.js";
import { Command } from "../../command";
import { checkVoiceStatus } from "./playerAPI";
import { Player } from "./playerState";

const command: Command = {
    name: "stop",
    description: "stops the music player and cleans up",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const query = args.join(' ');
        const guildId = message.guild?.id;
        try {
            if (guildId) {
                const player = Player.GuildQueues.get(guildId);
                if (player) {
                   Player.GuildQueues.delete(guildId);
                   await message.member?.voice.channel?.leave(); // leave the voice channel
                   message.channel.send('Stopped! Leaving the voice Channel.')
                }
            }

        } catch (err) {
            console.error(`${err}`);
        }

    }
};

export default command;


