import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export async function crawlWebsite(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const html = await page.content();
  const $ = cheerio.load(html);

  const title = $('title').text();
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const h1 = $('h1').first().text();
  const imagesWithoutAlt = $('img').filter((_, el) => !$(el).attr('alt')).length;

  const links = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.startsWith('http')) links.push(href);
  });

  await browser.close();

  return {
    title,
    metaDescription,
    h1,
    imagesWithoutAlt,
    totalLinks: links.length,
    links: links.slice(0, 10)
  };
}