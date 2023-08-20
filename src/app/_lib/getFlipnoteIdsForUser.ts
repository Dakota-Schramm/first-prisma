import puppeteer from 'puppeteer';
import { Prisma  } from '@prisma/client';
import { prisma } from '../_server/db'; // Partial import to allow for seed script

// TODO: Move most of the methods in this file into API routes

type Headless = "new" | true | false

export const USER_URL = 'https://archive.sudomemo.net/user' // + `/${user.id}` + "@DSi"
const FLIPNOTE_URL = 'https://archive.sudomemo.net/watch' // + `/${user.id}`
const HEADLESS_ENABLED: Headless = "new";

const userInclude = {
  id: true,
  name: true,
  flipnotes: {
    id: true,
    userId: false 
  },
} satisfies Prisma.UserInclude

type MyPostPayload = Prisma.UserGetPayload<
  { include: typeof userInclude }
>;

export async function getUserWithFlipnotes(userId: string) {
  let user: MyPostPayload | null = null;
  if (userId.length !== 16) {
    throw new Error('Invalid user id: length is not 16 characters');
  }

  try {
    user = await prisma.user
      .findUnique({ 
        where: { id: userId },
        include: { flipnotes: true },
      })

    if (!user) {
      const scrapedUser = await scrapeUserPage(userId)
      console.log("SU", scrapedUser)
      user = await prisma.user.create({
        data: {
          id: scrapedUser.id,
          name: scrapedUser.name,
          flipnotes: {
            createMany: {
              data: scrapedUser.flipnoteIds.map((id) => ( { id })),
            }
          },
        },
        include: { flipnotes: true },
      });
    
      if (!user) return null
    } 
    return {
      id:        user.id,
      userName:  user.name,
      flipnotes: user.flipnotes
    }
  } catch (e: any) {
    throw new Error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

// TODO: Convert this to better query only for ids
export async function getFlipnoteIdsByUserId(userId: string) {
  const data = await getUserWithFlipnotes(userId);
  if (data === null) return null

  const flipnotes = data?.flipnotes
  if (!flipnotes) return []
  return flipnotes.map(flipnote => flipnote.id)
}

// unused method
async function getFlipnoteIdsByUserName(userName: string) {
  let user: MyPostPayload | null = null;

  const possibleUsers = await prisma.user
    .findMany({ 
      where: { name: userName },
      include: { flipnotes: true },
    })

  if (!possibleUsers) return null
  user = possibleUsers[0]

  await prisma.$disconnect();

  return {
    userName: user.name,
    flipnotes: user.flipnotes
  }

}

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
