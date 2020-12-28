import puppeteer from "puppeteer";
import { search as YT_SEARCH } from "yt-search";

export const grabResultsFromPage = async(query: string) => {
  const SEARCH_URL = "https://www.youtube.com/results?search_query=";

  try {
    const URL: string = SEARCH_URL + query;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);
    await page.waitForSelector("#video-title");

    const videoLinks = await page.evaluate(() => {
      const data = Array.from(document.querySelectorAll('a#video-title')).map((value: Element) => {
        return [value.getAttribute('title'), value.getAttribute('href')];
      })
      return data
    });
    await browser.close();
    return videoLinks[0];
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}

export const spotifyPlaylistToYoutube = async (queries: string[]): Promise<Array<string | null> | undefined> => {
  const SEARCH_URL = "https://www.youtube.com/results?search_query=";
  try {
    const linksToCrawl = queries.map(q=> SEARCH_URL + q);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const URLQueue: Array<string | null> = [];
    
    for(const link of linksToCrawl) {
      await page.goto(link);
      await page.waitForSelector("#video-title");
  
      const relatedVid = await page.evaluate(() => {
        const data = Array.from(document.querySelectorAll('a#video-title')).map((value: Element) => {
          return value.getAttribute('href');
        })[0];
        return data
      });
      URLQueue.push(relatedVid);
    }
    await browser.close();
    return URLQueue;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};


