import { Client, Message } from "discord.js";
import { Command } from "../../botconfig";

const helpTemplate = `
  - Cool commands
      - !ud *query* -> Search urbandictionary.com 
      - !random -> grabs a random image off of flickr
      - !random *search_token* -> grabs a random image off of flickr related to the search_token
  - Music Player
      - !play *songname* -> Plays a song!
      - !queue -> returns all the songs in the queue listed out for you!
      - !resume/pause -> plays/resumes the currently playing song
      - !skip -> skips the current song in the queue
      - !stop -> Stops playing the song and exits the voice channel
  - Admin
      - !kick @member -> kicks the server member if the author has the correct permissions
      - !clear N -> deletes N number of messages up to a 100
      - !clear nuke -> clears the entire text channel
`;

// This will complain if you don't provide the right types for each property
const command: Command = {
  name: "help",
  description: "Sends the user a list of helpful commands that I can perform!",
  requiredPermissions: [],
  execute(client: Client, message: Message, args: string[])  {
    message.channel.send('Here are a list of commands I can currently use!');
    message.channel.send(helpTemplate);
  }
}

export = command;