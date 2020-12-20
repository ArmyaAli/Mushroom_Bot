import { Message, Client  } from "discord.js";
import path from "path";
import fileSystem from "fs";
import * as dotenv from "dotenv";

dotenv.config();

export function readCommandsRecursive(commandContext: string, commandFiles: string[]) {  
  fileSystem.readdirSync(commandContext).forEach((file) => {
    const Absolute = path.join(commandContext, file);
    if (fileSystem.statSync(Absolute).isDirectory())
      return readCommandsRecursive(Absolute, commandFiles);
    else 
      return commandFiles.push(Absolute);
  });
}

const config = {
    prefix: "!",
    token: process.env.BOT_TOKEN
}

export interface Command {
    name: string
    description: string
    requiredPermissions: string[]
    execute(client: Client, message: Message, args?: string[]): any
  }


export default config;