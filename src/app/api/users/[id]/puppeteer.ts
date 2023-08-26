import puppeteer from 'puppeteer';

type Headless = 'new' | true | false;
const HEADLESS_ENABLED: Headless = 'new';

export const USER_URL = 'https://archive.sudomemo.net/user'; // + `/${user.id}` + "@DSi"

export async function scrapeUserPage(userId: string) {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless: HEADLESS_ENABLED,
  });

  const page = await browser.newPage();
  await page.goto(`${USER_URL}/${userId}@DSi`, {
    waitUntil: 'domcontentloaded',
  });

  // Should also make sure it doesnt have Pagination__button--disabled selector
  const nextPageSelector = '.Pagination__button--next';
  const pageUserName = await page.evaluate(() => {
    const userName = document.querySelector('.UserInfo__name')?.textContent;

    return userName ?? '';
  });
  const pageStarCounts = await page.evaluate(() => {
    const starContainer = document.querySelector('.UserDetails__stars');
    if (!starContainer) return 1;

    const starElements = starContainer?.querySelectorAll('.Star');
    if (!starElements || starElements.length === 0) return 2;

    const starCounts = Array.from(starElements).map((c, idx) =>
      c.lastChild!.getAttribute('title')
    );

    return starCounts ?? 3;
  });

  const pageCounterSelector = '.Pagination__counter';
  let pageProgress = await page.evaluate((selector) => {
    function parse(str: string) {
      return Function(`'use strict'; return (${str})`)();
    }

    const pageCounterText = document.querySelector(selector)?.textContent ?? '';
    const progress = parse(pageCounterText);

    return progress;
  }, pageCounterSelector);

  let flipnoteIds: string[] = [];
  let done = false;
  while (!done) {
    if (pageProgress === 1) done = true;

    const flipnoteContainerSelector = '.MemoGrid';
    const currentPageFlipnoteIds = await page.evaluate((containerSelector) => {
      const flipnotes = Array.from(document.querySelectorAll('.MemoGridThumb'));

      const ids: string[] = flipnotes.map((flipnote) => {
        // @ts-expect-error
        const flipnoteId = flipnote.href.split('/').at(-1);

        return flipnoteId;
      });

      return ids;
    }, flipnoteContainerSelector);
    flipnoteIds = flipnoteIds.concat(currentPageFlipnoteIds);

    if (!done) {
      const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click(nextPageSelector),
      ]);

      pageProgress = await page.evaluate((selector) => {
        function parse(str: string) {
          return Function(`'use strict'; return (${str})`)();
        }

        const pageCounterText =
          document.querySelector(selector)?.textContent ?? '';
        const progress = parse(pageCounterText);

        return progress;
      }, pageCounterSelector);
    }
  }

  return {
    id: userId,
    name: pageUserName,
    flipnoteIds: flipnoteIds,
    stars: pageStarCounts,
  };
}
