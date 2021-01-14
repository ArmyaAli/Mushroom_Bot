import { StreamDispatcher } from 'discord.js';
import { EventEmitter } from 'events';
import { YT_SEARCH_VIDEO } from './youtube-scraper';

export class MusicStateManager extends EventEmitter {
    static musicQueue: YT_SEARCH_VIDEO[];
    static playingMusic: boolean;
    static dispatcher: StreamDispatcher | null;
    constructor() {
        super();
        MusicStateManager.musicQueue = [];
        MusicStateManager.playingMusic = false;
        MusicStateManager.dispatcher = null;
    }
}