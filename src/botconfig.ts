import path from "path";
import fileSystem from "fs";
import * as dotenv from "dotenv";
import { DisTubeOptions } from "distube";

dotenv.config();

export const readCommandsRecursive = (commandContext: string, commandFiles: string[]) => {  
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
    token: process.env.BOT_TOKEN_DEV
};

export const distubeConfig: DisTubeOptions = {
    leaveOnStop: false,
};

export default config;