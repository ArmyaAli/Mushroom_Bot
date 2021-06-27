import { Message, User } from "discord.js";
import ytdl from "ytdl-core";

export interface queueEntry {
    url: string;
    requestedBy: User;
}

export interface MusicPlayer {
    musicQueue: queueEntry[];
    currentSong: ytdl.videoInfo | null;
    playingMusic: boolean;
    message: Message;
}

export const Player = {
    GuildQueues: new Map<string, MusicPlayer>(),

};