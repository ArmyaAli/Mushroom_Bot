// import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
// import Queue from "distube/typings/Queue";
// import { Command } from "../../command";
// import MusicManager from "../../util/global-util/MusicManager";

// const command: Command = {
//     name: "skip",
//     description: "Skips the current song playing in the queue.",
//     requiredPermissions: [],
//     async execute(client: Client, message: Message, args: string[]) {
//         try {
//             if (MusicManager.Instance) {
//                 if (MusicManager.musicQueue.length > 0) {
//                     const next = MusicManager.musicQueue.shift()
//                     if (next) {
//                         MusicManager.currentSong = next;
//                         await MusicManager.Instance.playSkip(message, next.url)
//                         MusicManager.Instance.getQueue(message).autoplay = true;
//                     }
//                     return;
//                 }

//                 message.channel.send("Currently no songs in the queue. Defaulting to playing the next related song...");
//                 await MusicManager.Instance.addRelatedVideo(message)
//                 MusicManager.Instance.skip(message)
                
//             };
//         } catch (error) {
//             console.log(error);
//         }
//     },
// };

// export = command;
