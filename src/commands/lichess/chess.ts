import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import { Command } from "../../command";
import fetch from "node-fetch"


const getChallegeLink = async () => {
    const createGameURL = "https://lichess.org/api/challenge/open";
    const formBody: string[] = [];
    let gameConfig = {
        'clock.limit': '1200',
        'clock.increment': '0',
    };

    for (const prop in gameConfig)
        formBody.push(`${encodeURIComponent(prop)}=${encodeURIComponent(gameConfig[prop as 'clock.limit' | 'clock.increment'])}`);

    const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.join("&"),
    };

    try {
        const response = await fetch(createGameURL, options);
        const createdGame = await response.json();
        return createdGame.challenge.url;
    } catch (error) {
        console.log(`Error: ${error}`);
    }
};

const command: Command = {
    name: "chess",
    description: "Creates a lichess challenge and presents the URL",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        try {
            const gameLink = await getChallegeLink();
            await message.channel.send(gameLink)
        } catch (error) {
            console.log(error);
        }
    },
};

export = command;
