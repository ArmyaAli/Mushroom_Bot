import { Client, Message } from "discord.js";
import { Command } from "../../command";
import { checkVoiceStatus, shuffle } from "./playerAPI";
import { Player } from "./playerState";

const command: Command = {
    name: "shuffle",
    description: "shuffles the music queue",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        if (!checkVoiceStatus(client, message)) return;
        const guildId = message.guild?.id;
        try {
            if (guildId) {
                const player = Player.GuildQueues.get(guildId);
                if (player) {
                   player.musicQueue = shuffle(player.musicQueue);
                   message.channel.send('Re-arranging the music queue!~ Shuffling')
                }
            }

        } catch (err) {
            console.error(`${err}`);
        }

    }
};

export default command;



