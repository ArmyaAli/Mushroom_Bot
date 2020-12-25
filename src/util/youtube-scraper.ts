import puppeteer from "puppeteer";

export const grabResultsFromPage = async (query: string): Promise<Map<string | null, string | null> | undefined> => {
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
    videoLinks.forEach(link => results.set(link[0], 'https://youtube.com'+ link[1]));
    await browser.close();
    return results;
  } catch (err) {
    console.log(`Error: ${err}`);
  }
};


