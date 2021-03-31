import { BaseClient, Client, Guild, GuildMember, Message, User, VoiceChannel, VoiceConnection } from "discord.js";
import DisTube, { DisTubeOptions } from "distube";
import Queue from "distube/typings/Queue";
import Song from "distube/typings/Song";

export interface SongData {
    name: string;
    artist?: string;
    url: string;
    requestedBy: User | null;
}

export interface musicPlayer {
    Instance: DisTube;
    Queue: SongData[];
    currentSong: SongData | null;
    firstAuthor: User | undefined;
    addingPlaylist: boolean;
    message: Message;
}

// if nobody is playing music -> there will be no queue
class _MusicManager {
    musicQueue: Map<string, musicPlayer>;

    constructor() {
        this.musicQueue = new Map();
    }

    registerEvents(player: musicPlayer): void {
        if (player.Instance) {

            player.Instance.on("empty", (message: Message) => {
                player.addingPlaylist = false;
                message.channel.send("Channel is empty. Leaving the channel. Mushoomie ~ !!")
            })

            player.Instance.on("finish", (message: Message) => {
                if (player.Instance) {
                    if (player.Queue.length > 0) {
                        const next = player.Queue.shift()
                        if (next) {
                            player.currentSong = next;
                            player.Instance.play(message, next.url);
                        }
                    } else {
                        message.channel.send("No more songs in Queue. Idling")
                    }
                }
            });

            player.Instance.on("playSong", (message: Message, queue: Queue, song: Song) => {
                message.channel.send(
                    `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${player.currentSong === null ? player?.firstAuthor : player.currentSong?.requestedBy}`
                )
            });

            player.Instance.on("error", (message: Message, err) => message.channel.send(
                "An error encountered: " + err
            ));
        }

    }
}

const MusicManager = new _MusicManager();


export default MusicManager;