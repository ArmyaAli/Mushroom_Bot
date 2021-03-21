import { BaseClient, Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import DisTube, { DisTubeOptions } from "distube";
import Queue from "distube/typings/Queue";
import Song from "distube/typings/Song";

export interface SongData {
    name: string;
    artist: string;
    url: string;
    requestedBy: string;
}
class _DistubeManager {
    Instance: DisTube | null;
    addingPlaylist: boolean;
    musicQueue: SongData[];
    currentSong: SongData | null;
    constructor() {
        this.Instance = null;
        this.addingPlaylist = false;
        this.musicQueue = [];
        this.currentSong = null;
    }

    registerEvents(): void {
        if (this.Instance) {

            this.Instance.on("empty",  (message: Message) => {
                this.addingPlaylist = false;
                message.channel.send("Channel is empty. Leaving the channel. Mushoomie ~ !!")
            })

            this.Instance.on("finish", (message: Message) => {                    
                if (this.Instance) {
                    if (this.musicQueue.length > 0) {
                        const next = this.musicQueue.shift()
                        if (next) {
                            this.currentSong = next;
                            this.Instance.play(message, next.url);
                        }
                    } else {
                        message.channel.send("No more songs in Queue. Idling")
                    }
                }
            });

            this.Instance.on("initQueue", (queue: Queue) => {
                
                queue.autoplay = true;
                queue.volume = 50;
            });

            this.Instance.on("playSong", (message: Message, queue: Queue, song: Song) => {
                // `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`

                message.channel.send(
                    `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${this.currentSong === null ? message.member?.user : this.currentSong!.requestedBy}`
                )
            });

            this.Instance.on("error", (message: Message, err) => message.channel.send(
                "An error encountered: " + err
            ));



        }

    }
}

const DistubeManager = new _DistubeManager();


export default DistubeManager;