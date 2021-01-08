import fetch, { RequestInit } from "node-fetch";

export interface SPOTIFY_PLAYLIST_SONG {
  title: string;
  artist: string;
  album: string;
}

  const authorize = async (): Promise<string | undefined> => {
    const ACCESS_TOKEN_URL = "https://accounts.spotify.com/api/token/";
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    const params = new URLSearchParams({
      grant_type: "client_credentials",
    });

    const options: RequestInit = {
      // These properties are part of the Fetch Standard
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      }, // request headers. format is the identical to that accepted by the Headers constructor (see below)
      body: params,
      compress: true,
    };
    try {
      const response = await fetch(ACCESS_TOKEN_URL, options);
      const authenticated = await response.json();
      return authenticated.access_token;
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

export const grabAllSongsFromPlaylist = async (
  id: string | undefined
): Promise<Array<SPOTIFY_PLAYLIST_SONG> | undefined> => {
  if (id === undefined) return;
  const URL = `https://api.spotify.com/v1/playlists/${id}/tracks?`;

  try {
    const BEARER_TOKEN = await authorize();
    const options: RequestInit = {
      // These properties are part of the Fetch Standard
      method: "GET",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      }, // request headers. format is the identical to that accepted by the Headers constructor (see below)
      compress: true,
    };

    const songData: Array<SPOTIFY_PLAYLIST_SONG> = [];

    let response = await fetch(URL, options);
    let data = await response.json();
    do {
      data.items.forEach((song: any) => {
        songData.push({
          title: song.track.name,
          artist: song.track.artists
            .map((artist: any) => artist.name)
            .join(","),
          album: song.track.album.name,
        });
      });
      if (data.next) {
        response = await fetch(data.next, options);
        data = await response.json();
      }
    } while (songData.length < data.total);
    return songData;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
