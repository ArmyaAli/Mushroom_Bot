import { Client, Message} from "discord.js";
import { Command } from "../../command";

const command: Command = {
    name: "pogoff",
    description: "Flips the bird, poggers",
    requiredPermissions: [],
    async execute(client: Client, message: Message, args: string[]) {
        message.channel.send({ files: ["assets/pogoff.png"] })
    }
}

export default command;

