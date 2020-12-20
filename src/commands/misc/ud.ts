import { Client, Message, MessageEmbed } from "discord.js";
import { Command } from "../../botconfig";

// This will complain if you don't provide the right types for each property
const command: Command = {
  name: "ud",
  description: "Searches urban dictionary for the user specified query and grabs the first 5 results sorted by upvote count",
  async execute(client: Client, message: Message, args: string[])  {
    const fetch = require("node-fetch");
    const searchQuery: string = args.join(" ");
    const api = `http://api.urbandictionary.com/v0/define?term=${searchQuery}`;
    try {
      const rawdata = await fetch(api);
      const json = await rawdata.json();

      if(json.list === undefined || json.list.length === 0)
        throw 'No results found! Try a different query';

        const results = json.list.slice(0, 5).sort((a:any, b:any) =>  b.thumbs_up - a.thumbs_up)
        for(let i = 0; i < results.length; ++i) {
          const msgFormat = `Definition
                            ${results[i].definition} 

                            Example
                            ${results[i].example}
                          `;
          await message.channel.send(new MessageEmbed()
          .setTitle(`Word: ${searchQuery} UP: ${results[i].thumbs_up} DOWN: ${results[i].thumbs_down}`)
          .setColor(0xff0000)
          .setURL(results[i].permalink)
          .setDescription(msgFormat));
      }
    } catch(error) {
      message.channel.send(`Error occured: ${error}`);
    }
  }
}

export = command;