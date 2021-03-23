import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "../../command";
import fetch from 'node-fetch';
// This will complain if you don't provide the right types for each property
const command: Command = {
    name: "pogoff",
    description: "Flips the bird, poggers",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        message.channel.send({ files: ["assets/pogoff.png"] })
    }
}

export = command;

