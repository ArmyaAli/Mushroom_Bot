import { Client, Message } from "discord.js";

export const checkVoiceStatus = (client: Client, message: Message) => {
    let inVoice = true;
    try {
        if (message.guild) {
            const GUILD_ID = message.guild.id;
            const USER_ID = message.author.id;
            const server = client.guilds.cache.get(GUILD_ID); // Getting the guild.
            if (server) {
                const member = server.members.cache.get(USER_ID); // Getting the member.
                if (member) {
                    if (!member.voice.channel) {
                        message.channel.send("You must be in a voice channel to use this command.");
                        inVoice = false;
                    }
                }
            }
            return inVoice;
        }
    } catch (err) {
        console.log(`Procedure [inVoice] in Play command, Error: ${err}`)
    }
}