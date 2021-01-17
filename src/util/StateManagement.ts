import { StreamDispatcher } from 'discord.js';
import { EventEmitter } from 'events';
import { YT_SEARCH_VIDEO } from '../commands/music-player/player-util/youtube-scraper';


class _MusicStateManager extends EventEmitter {
    currentSong: YT_SEARCH_VIDEO | null;
    musicQueue: YT_SEARCH_VIDEO[];
    playingMusic: boolean;
    batching: boolean;
    dispatcher: StreamDispatcher | null;
    clearedQ: boolean;
    constructor() {
        super();
        this.musicQueue = [];
        this.playingMusic = false;
        this.dispatcher = null;
        this.batching = false;
        this.clearedQ = false;
        this.currentSong = null;
    }
};

export const MusicStateManager = new _MusicStateManager();
