import fetch from 'node-fetch';

// spotify playlist -> grab all titles

export const grabAllSongsFromPlaylist = async (playlistLink: string): Promise<string[] | undefined> => {
    const API_ENDPOINT = "https://api.spotify.com/v1/playlists/"
    try {
      let titles: string[] = [];
      return titles;
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };