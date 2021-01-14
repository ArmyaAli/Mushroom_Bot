import { MusicStateManager } from "../../../util/StateManagement";
import { SPOTIFY_PLAYLIST_SONG } from "./spotify-API-service";
import { getURLQueueFromQueries } from "./youtube-scraper";

export const batchQueue = async (
    queries: SPOTIFY_PLAYLIST_SONG[],
  ): Promise<void> => {
    const batch: Array<SPOTIFY_PLAYLIST_SONG> = [];
    if (!queries) return;
    MusicStateManager.batching = true;
    for (let i = 0; i < 5; ++i) {
      const item = queries.shift();
      if (item) {
        batch.push(item);
      }
    }
    try {
      // batch of 5
      console.log(batch);
      await getURLQueueFromQueries(batch, MusicStateManager.musicQueue);
  
    } catch (error) {
      console.log("Error batching");
    }
  };
  