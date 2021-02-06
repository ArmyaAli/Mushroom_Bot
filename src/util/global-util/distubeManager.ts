import { BaseClient, Client, Message, VoiceChannel, VoiceConnection } from "discord.js";
import DisTube, { DisTubeOptions } from "distube";

class _DistubeManager {
    Instance: DisTube | null;
    constructor() {
        this.Instance = null;
    }
}

const DistubeManager = new _DistubeManager();


export default DistubeManager;