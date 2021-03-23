// import { Client, Message, MessageEmbed } from "discord.js";
// import Queue from "distube/typings/Queue";
// import { Command } from "../../command";
// import MusicManager from "../../util/global-util/MusicManager";

// const command: Command = {
//     name: "stop",
//     description: "Displays the current queue of the DisTube music player.",
//     requiredPermissions: [],
//     async execute(client: Client, message: Message, args: string[]) {
//         const stoppedPlaylist = new MessageEmbed()
//             .setTitle('Stopped adding the playlist')
//             .setColor(0xff0000)
//         try {
//             if (MusicManager.Instance) {
//                 MusicManager.Instance.stop(message);
//                 MusicManager.musicQueue = []
//                 MusicManager.addingPlaylist = false;
//                 MusicManager.currentSong = null;
//                 MusicManager.firstAuthor = undefined;
//                 await message.channel.send(stoppedPlaylist)
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     },
// };

// export = command;
