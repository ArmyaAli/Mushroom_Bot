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
    nextRelated: string;
    constructor() {
        this.Instance = null;
        this.addingPlaylist = false;
        this.musicQueue = [];
        this.nextRelated = "";
    }

    registerEvents(): void {
        if (this.Instance) {

            this.Instance.on("empty", async (message: Message) => {
                this.addingPlaylist = false;
                await message.channel.send("Channel is empty. Leaving the channel. Mushoomie ~ !!")
            })

            this.Instance.on("finish", async (message: Message) => {
                console.log("Finish event occued")
                if (this.Instance) {
                    if (this.musicQueue.length > 0) {
                        const next = this.musicQueue.shift()
                        if (next) {
                            this.Instance.play(message, next.url);
                        }
                    } else {
                        if(this.nextRelated != "") {
                            await message.channel.send("No more song in queue, will start autoplaying soon or leave!")
                            await this.Instance.play(message, this.nextRelated);
                            return;
                        }
                        setTimeout(() => {
                            (message.member?.voice.channel as VoiceChannel).leave();
                        }, 5000)
                        
                    }
                }
            });

            this.Instance.on("initQueue", (queue: Queue) => {
                queue.autoplay = false;
                queue.volume = 50;
            });

            this.Instance.on("playSong", (message: Message, queue: Queue, song: Song) => {
                if (this.Instance) {
                    this.Instance.addRelatedVideo(message);
                    const relatedSong = this.Instance.getQueue(message).songs.shift()
                    if (relatedSong) {
                        this.nextRelated = relatedSong.url
                    }

                    if (song) {
                        this.Instance.play(message, song.url);
                    }
                }
                message.channel.send(
                    `Playing \`${song.name}\` - \`${song.formattedDuration}\``
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