import { Agent } from "http";
import fetch, { RequestInit } from "node-fetch";
import { unregisterCustomQueryHandler } from "puppeteer";

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
       "Authorization": `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
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

export const grabAllSongsFromPlaylist = async (id: string | undefined): Promise<Array<Array<string | null>> | undefined> => {
  if(id === undefined) return;
  const URL = `https://api.spotify.com/v1/playlists/${id}?`;
  const params = new URLSearchParams({
    fields: "tracks.items",
  });
  try {
    const options: RequestInit = {
      // These properties are part of the Fetch Standard
      method: "GET",
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Authorization": `Bearer ${await authorize()}`,
      }, // request headers. format is the identical to that accepted by the Headers constructor (see below)
      compress: true,
    };

    const response = await fetch(URL + params, options);
    const data = await response.json();
    const titles: string[][] = data.tracks.items.map((item: any) => {
      return [item.track.album.name, item.track.artists.map((artist: any) => artist.name).join(','), item.track.name];
    });
    return titles;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
