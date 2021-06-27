import { Message } from "discord.js";

export interface MusicPlayer {
    musicQueue: string[];
    currentSong: string;
    playingMusic: boolean;
    message: Message;
}

export const Player = {
    GuildQueues: new Map<string, MusicPlayer>(),

};