import { EventEmitter } from 'events';
import { YT_SEARCH_VIDEO } from './youtube-scraper';

class StateManger extends EventEmitter {
    musicQueue: YT_SEARCH_VIDEO[];
    playingMusic: boolean;
    constructor () {
        super();
        this.musicQueue = [];
        this.playingMusic = false;
    }
}