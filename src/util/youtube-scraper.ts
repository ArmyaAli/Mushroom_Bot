import { search as YT_SEARCH } from "yt-search";
import { SPOTIFY_PLAYLIST_SONG } from "./spotify-API-service";

export interface YT_SEARCH_VIDEO {
  title: string;
  url: string;
}

export const getURLFromQuery = async (query: string): Promise<YT_SEARCH_VIDEO | undefined> => {
  try {
      const results = await YT_SEARCH(query);
      const firstVideo = results.videos[0];
      const title = firstVideo.title;
      const url = firstVideo.url;
      return { title, url };
    } catch (err) {
    console.log(`Error: ${err}`);
  }
}

export const getURLQueueFromQueries = async (queries: SPOTIFY_PLAYLIST_SONG[], queue: any[]): Promise<void> => {
  if(!queries) return;
  try {
    for(const query of queries) {
      const searchVal = `${query.title} ${query.artist} ${query.album}`;
      const results = await YT_SEARCH(searchVal);
      const result = results.videos[0].url
      const title = results.videos[0].title
      queue.push({title: title, url: result});
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};


