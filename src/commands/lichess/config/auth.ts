import { ACCOUNT, USER } from "./endpoints"
import fetch from "node-fetch"

export const authorize = async () => {
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.LICHESS_TOKEN}`
        }
    };
    try {
        console.log(ACCOUNT)
        const response = await fetch(ACCOUNT, options);
        const authenticated = await response.json();
        console.log(authenticated)
        return authenticated;
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}