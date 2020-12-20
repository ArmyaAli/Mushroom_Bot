import { Client, Message } from "discord.js";
import { Command } from "../../botconfig";

// This will complain if you don't provide the right types for each property
const command: Command = {
  name: "ud",
  description: "Searches urban dictionary for the user specified query and grabs the first 5 results sorted by upvote count",
  execute(client: Client, message: Message, args: string[])  {
  }
}

export = command;