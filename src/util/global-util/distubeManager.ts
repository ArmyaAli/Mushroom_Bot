import { BaseClient, Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import DisTube, { DisTubeOptions } from "distube";
import Queue from "distube/typings/Queue";
import Song from "distube/typings/Song";

export interface SongData {
    name: string;
    artist: string;
    url: string;
}
class _DistubeManager {
    Instance: DisTube | null;
    addingPlaylist: boolean;
    musicQueue: SongData[];
    constructor() {
        this.Instance = null;
        this.addingPlaylist = false;
        this.musicQueue = [];
    }

    registerEvents(): void {
        if (this.Instance) {

            this.Instance.on("empty", async (message: Message) => {
                this.addingPlaylist = false;
                await message.channel.send("Channel is empty. Leaving the channel. Mushoomie ~ !!")
            })

            this.Instance.on("finish", (message: Message) => {
                console.log("Finish event occued")
                if (this.musicQueue.length > 0) {
                    const next = this.musicQueue.shift()
                    if (this.Instance) {
                        if (next)
                            this.Instance.play(message, next.url);
                        // playlist is done
                        else
                            this.Instance.getQueue(message).autoplay = false;
                    }
                } else {
                    message.channel.send("No more song in queue Leaving the voice channel shortly.")

                }
            })

            this.Instance.on("initQueue", (queue: Queue) => {
                queue.autoplay = false;
                queue.volume = 50;
            });

            this.Instance.on("playSong", (message: Message, queue: Queue, song: Song) => {
                message.channel.send(
                    `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n`
                )
            });
            this.Instance.on("addSong", (message: Message, queue: Queue, song: Song) => {
                message.channel.send(
                    `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)
            });
            this.Instance.on("error", (message: Message, err) => message.channel.send(
                "An error encountered: " + err
            ));



        }

    }
}

const DistubeManager = new _DistubeManager();


export default DistubeManager;