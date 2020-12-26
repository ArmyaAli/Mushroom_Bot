import puppeteer from "puppeteer";

export const grabResultsFromPage = async (query: string): Promise<(string | null)[][] | undefined> => {
  const SEARCH_URL = "https://www.youtube.com/results?search_query=";

  try {
    const URL: string = SEARCH_URL + query;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let results = new Map<string | null, string|null>();
    await page.goto(URL);
    await page.waitForSelector("#video-title");

    const videoLinks = await page.evaluate(() => {
      const data = Array.from(document.querySelectorAll('a#video-title')).map((value: Element) => {
        return [value.getAttribute('title'), value.getAttribute('href')];
      })
      return data
    });
    if(!videoLinks)
      throw 'Could not find any results'
    await browser.close();
    return videoLinks;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};


