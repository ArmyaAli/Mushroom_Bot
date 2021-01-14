
## Mushroom_Bot
Hi! This is a discord bot that's my very own. I wrote it for myself to use and maybe show to my friends and make it do stuff. I originally wrote a bunch of features with vanilla js and node but I wanted to use typescript so I will be migrating my old code to this piece by piece. Once that's complete i'll start adding more features!

## Motivation
This project exists because I wanted to learn more about the typescript/javascript ecosystem. What better way to learn than by doing a project?

## Screenshots
![Alt text](https://i.imgur.com/MQtnZQy.png "Urban dictionary search..! :)")
## Tech/framework used
Node.js, Typescript, Discord.js, ****discord-music-player.js by SushiBtW (moving away from this and using my own implementation)

<b>Built with</b>
- [DiscordJS](https://discord.js.org/#/docs/main/stable/general/welcome)

## Features
Currently working featureset
  - Cool commands
      - !ud *query* -> Search urbandictionary.com 
      - !random -> grabs a random image off of flickr
      - !random *search_token* -> grabs a random image off of flickr related to the search_token
  - Music Player (IN PROGRESS -> MIGRATING AWAY FROM USING discord-music-player library used in my previous bot and writing my own youtube scraper with a spotify playlist scraper...)
      - !play *songname* -> Plays a song! This also supports queuing up a spotify playlist! (WORKING)
      - !queue -> returns all the songs in the queue listed out for you! (NOT WORKING)
      - !resume/pause -> plays/resumes the currently playing song (NOT WORKING)
      - !skip -> skips the current song in the queue (NOT WOKRING)
      - !stop -> Stops playing the song and exits the voice channel (WORKING)
        - THINGS I WANT TO ADD 
            - !loop - will loop a single song
            - !play - add soundcloud support and youtube playlist support
            - !skip *songs to skip ahead*
  - Admin
      - !kick @member -> kicks the server member if the author has the correct permissions
      - !clear N -> deletes N number of messages up to a 100
      - !clear nuke -> clears the entire text channel

## Installation
To use the bot you can clone it and run an npm install... You'll also need your very own discord application setup on discords backend developer portal. Please see discordjs documentation, it is very thorough!

MIT © [Ali Umar]()
