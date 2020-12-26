import { Agent } from "http";
import fetch, { RequestInit } from "node-fetch";

export const authorize = async (): Promise<string | undefined> => {
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

export const grabAllSongsFromPlaylist = async (
  playlistLink: string
): Promise<string[] | undefined> => {
  const API_BASE = "https://api.spotify.com";
  try {
    let titles: string[] = [];
    return titles;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};
