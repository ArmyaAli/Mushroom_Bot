import { StreamDispatcher } from 'discord.js';
import { EventEmitter } from 'events';
import { YT_SEARCH_VIDEO } from './youtube-scraper';


class _MusicStateManager extends EventEmitter {
    musicQueue: YT_SEARCH_VIDEO[];
    playingMusic: boolean;
    dispatcher: StreamDispatcher | null;
    constructor() {
        super();
        this.musicQueue = [];
        this.playingMusic = false;
        this.dispatcher = null;
    }
};
export const MusicStateManager = new _MusicStateManager();
