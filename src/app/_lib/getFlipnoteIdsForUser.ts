import puppeteer from 'puppeteer';
import { Prisma, PrismaClient } from '@prisma/client';

import type { Flipnote } from '@prisma/client';

type Headless = "new" | true | false

export const USER_URL = 'https://archive.sudomemo.net/user' // + `/${user.id}` + "@DSi"
const FLIPNOTE_URL = 'https://archive.sudomemo.net/watch' // + `/${user.id}`
const HEADLESS_ENABLED: Headless = "new";

const userInclude = {
  id: true,
  name: true,
  flipnoteTotal: true,
  flipnotes: {
    id: true,
    userId: false 
  },
} satisfies Prisma.UserInclude

type MyPostPayload = Prisma.UserGetPayload<{ include: typeof userInclude }>;


export async function getFlipnoteIdsByUserId(userId: string) {
  const prisma = new PrismaClient();
  let user: MyPostPayload | null = null;
  if (userId.length !== 16) {
    throw new Error('Invalid user id: length is not 16 characters');
  }

  user = await prisma
    .user
    .findUnique({ 
      where: { id: userId },
      include: { flipnotes: true },
    })

  try {
    if (!user) {
      const scrapedUser = await scrapeUserPage(userId)
      console.log("SU", scrapedUser)
      user = await prisma.user.create({
        data: {
          id: scrapedUser.id,
          name: scrapedUser.name,
          flipnoteTotal: scrapedUser.flipnoteTotal, // TODO: See https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#relation-count
          flipnotes: {
            createMany: {
              data: scrapedUser.flipnoteIds.map((id) => ( { id })),
            }
          },
        },
        include: { flipnotes: true },
      });
      console.log("user", user)

      if (!user) return null
      return user.flipnotes.map((flipnote: Flipnote) => flipnote.id)
    } else {
      return user.flipnotes.map((flipnote: Flipnote) => flipnote.id)
    }
  } catch (e: any) {
    throw new Error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

// TODO: Maybe finish implementing this method?
// async function getFlipnoteIdsByUserName(userName: string) {
//   let user: User | null = null;
//   user = await prisma
//     .user
//     .findUnique({ where: { name: input } })

//   if (!user) throw Error('This search method requires a favorited userName')
//   return user.flipnotes.map(flipnote => flipnote.id)
// }

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
    const userName = document
      .querySelector('.UserInfo__name')
      ?.textContent

    return userName ?? '';
  });
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
    const currentPageFlipnoteIds = await page.evaluate((containerSelector) => {
      const flipnotes = Array.from(document.querySelectorAll('.MemoGridThumb'));

      const ids: string[] = flipnotes.map((flipnote) => {
        // @ts-expect-error
        const flipnoteId = flipnote.href 
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

  return {
    id: userId,
    name: pageUserName,
    flipnoteTotal: flipnoteIds.length,
    flipnoteIds: flipnoteIds 
  }
}
