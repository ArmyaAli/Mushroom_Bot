import { Client, Message, MessageEmbed } from "discord.js";
import { URLSearchParams } from "url"

module.exports = {
  name: "random",
  description: "pulls a random image off of Flickr",
  async execute(client: Client, message: Message, args: string[])  {
    const path = require("path");
    const fetch = require("node-fetch");
    const searchQuery = args.join(" ");
    let params = new URLSearchParams({
      api_key: process.env.FLICKR_TOKEN,
      method: searchQuery === "" ? "flickr.photos.getRecent" : "flickr.photos.search",
      text: searchQuery,
      format: "json",
      nojsoncallback: "true",
    });

    const api = "https://www.flickr.com/services/rest/?";
    const photoLink = "https://live.staticflickr.com/";
    try {
      const response = await fetch(api + params);
      const json = await response.json();
      const noOfPages = json.photos.pages;
      params.append("page", Math.floor(Math.random() * noOfPages).toString());
      const nextresponse = await fetch(api + params);
      const nextjson = await nextresponse.json();
      const photos = nextjson.photos.photo;
      const chosen = photos[Math.floor(Math.random() * 100)];
      console.log(chosen)
      // https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg
      const lastThree = `${chosen.id}_${chosen.secret}_m.jpg`;
      const url = photoLink + path
        .join(chosen.server, lastThree)
        .replace(/\\/g, "/");
      const image = new MessageEmbed()
        .setTitle(chosen.title)
        .setImage(url);
      message.channel.send(image)
    } catch (error) {
      message.channel.send(`Error occured: ${error}`);
    }
  },
};
