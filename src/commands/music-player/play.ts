import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "../../command";
import { grabResultsFromPage } from "../../util/youtube-scraper"
import URL from 'url';
// This will complain if you don't provide the right types for each property
const command: Command = {
  name: "play",
  description:
    "Searches youtube for a specified song! ",
  requiredPermissions: [],
  async execute(client: Client, message: Message, args: string[]) {
    // check if argument is a valid url
    const query = args.join(' ');
    console.log(await grabResultsFromPage(query));
  },
};

export = command;
