import puppeteer from 'puppeteer';
import { getQueryParametersFromUrl } from './getQueryParameters';


export const userURL = 'https://archive.sudomemo.net/user' // + `/${user.id}` + "@DSi"
const flipnoteURL = 'https://archive.sudomemo.net/watch' // + `/${user.id}`

type Headless = "new" | true | false
const HEADLESS_ENABLED: Headless = "new";

async function getFlipnoteIdsForUser(input: string) {
  // let user;
  let user = {
    id: '56650B50CC783E17',
    name: 'Gizmo',
  };

  // if (input.length === 16) {
  //   // input is user.id
  //   user = await prisma.user
  //   .findUnique({ where: { id: input } })
  // } else {
  //   // input is user.name
  //   user = await prisma.user
  //   .findUnique({ where: { name: input } })
  // }

  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless: HEADLESS_ENABLED,
  });

  const page = await browser.newPage();
  await page.goto(`${userURL}/${user.id}@DSi`, {
    waitUntil: 'domcontentloaded',
  });

  // Should also make sure it doesnt have Pagination__button--disabled selector
  const nextPageSelector = '.Pagination__button--next';
  const pageCounterSelector = '.Pagination__counter'
  let pageProgress = await page.evaluate((selector) => {
    function parse(str: string) {
      return Function(`'use strict'; return (${str})`)()
    }

    const pageCounterText = document.querySelector(selector)?.textContent ?? '';
    const progress = parse(pageCounterText);

    return progress
  }, pageCounterSelector);

  let flipnoteIds: string[] = [];
  let done = false;
  while (!done) {
    if (pageProgress === 1) done = true;

    const flipnoteContainerSelector = '.MemoGrid';
    const currentPageFlipnoteIds = await page.evaluate((containerSelector, idx) => {
      const flipnotes = Array.from(document.querySelectorAll('.MemoGridThumb'));

      const ids: string[] = flipnotes.map((flipnote) => {
        const flipnoteId = flipnote
          .href
          .split('/')
          .at(-1);

        return flipnoteId;
      });

      return ids;
    }, flipnoteContainerSelector);
    flipnoteIds = flipnoteIds.concat(currentPageFlipnoteIds)

    if (!done) {
      const [response] = await Promise.all([
        page.waitForNavigation(),
        page.click(nextPageSelector),
      ]);

      pageProgress = await page.evaluate((selector) => {
        function parse(str: string) {
          return Function(`'use strict'; return (${str})`)()
        }

        const pageCounterText = document.querySelector(selector)?.textContent ?? '';
        const progress = parse(pageCounterText);

        return progress
      }, pageCounterSelector);
    }
  }

  return flipnoteIds 
}


export default getFlipnoteIdsForUser