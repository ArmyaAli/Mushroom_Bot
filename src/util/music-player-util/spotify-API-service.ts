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
            "Content-type": "application/x-www-form-urlencoded;",
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
    id: string
): Promise<Array<string> | undefined> => {

    const URL = `https://api.spotify.com/v1/playlists/${id}/tracks`
    try {
        const BEARER_TOKEN = await authorize();

        const options: RequestInit = {
            // These properties are part of the Fetch Standard
            method: "GET",
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            }, // request headers. format is the identical to that accepted by the Headers constructor (see below)
        };

        const songData: Array<string> = [];

        let response = await fetch(URL, options);
        let data = await response.json();
        const TOTAL = data.total;
        let OFFSET = 0;

        while (OFFSET < TOTAL) {
            data.items.forEach((item: any) => {
                songData.push(`${item.track.name},${item.track.artists.map((artist: any) => artist.name).join(',')}`)
            });

            OFFSET += 100
            response = await fetch(URL + `?offset=${OFFSET}&limit=100`, options);
            data = await response.json()
        }

        return songData;
    } catch (err) {
        console.log(`Error: ${err}`);
    }
};