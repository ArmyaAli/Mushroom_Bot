// import { Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
// import Queue from "distube/typings/Queue";
// import { Command } from "../../command";
// import MusicManager from "../../util/global-util/MusicManager";

// const command: Command = {
//     name: "pause",
//     description: "Stops current song in the queue.",
//     requiredPermissions: [],
//     async execute(client: Client, message: Message, args: string[]) {
//         try {
//             if (MusicManager.Instance) {
//                 let queue: Queue = MusicManager.Instance.getQueue(
//                     message
//                 );
//                 if (queue == undefined) {
//                     message.channel.send("Currently no songs in the queue.");
//                 } else if (MusicManager.Instance.isPaused(message)) {
//                     message.channel.send("Song is currently paused.");
//                 } else {
//                     MusicManager.Instance.pause(message);
//                     message.channel.send("Pausing song.");
//                 }
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     },
// };

// export = command;
