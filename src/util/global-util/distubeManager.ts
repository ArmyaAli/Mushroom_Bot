import { BaseClient, Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import DisTube, { DisTubeOptions } from "distube";
import Queue from "distube/typings/Queue";
import Song from "distube/typings/Song";

class _DistubeManager {
    Instance: DisTube | null;
    addingPlaylist: boolean;
    constructor() {
        this.Instance = null;
        this.addingPlaylist = true;
    }

    registerEvents(): void {
        if (this.Instance) {

            this.Instance.on("empty", (message: Message) => message.channel.send("Channel is empty. Leaving the channel"))
            this.Instance.on("playSong", (message: Message, queue: Queue, song: Song) => {
                const status = (queue: Queue) => {
                    `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ?
                        "Server Queue" : "This Song" : "Off"}\` | Autoplay: \`$ {queue.autoplay ? "On" : "Off"}\``
                }

                message.channel.send(
                    `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n`
                )
            });
            this.Instance.on("addSong", (message: Message, queue: Queue, song: Song) => {
                if (!this.addingPlaylist)
                    message.channel.send(
                        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)
            });
            this.Instance.on("error", (message: Message, err) => message.channel.send(
                "An error encountered: " + err
            ));
            this.Instance.on("finish", (message: Message) => message.channel.send("No more song in queue Leaving the voice channel shortly."));


        }

    }
}

const DistubeManager = new _DistubeManager();


export default DistubeManager;