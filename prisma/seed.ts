// @ts-ignore
import { PrismaClient } from '@prisma/client';

import { scrapeUserPage } from '@/app/api/users/[id]/puppeteer';
import { userStudioIds } from '../src/app/_utils/constants';
import log from '@/app/_utils/log';

const prisma = new PrismaClient();

async function main() {
  const userRequests = userStudioIds.map(async (id) => await upsertUser(id))
  const users = await Promise.all(userRequests);

  log.debug(users);
}

main()
  .then(async () => {
    log.info('Shutting down seed script...')
    await prisma.$disconnect();
    process.exit()
  })
  .catch(async (e) => {
    log.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


async function upsertUser(userId: string) {
  const page = await scrapeUserPage(userId);

  const newUser = await prisma.user.upsert({
    include: { flipnotes: true, starCounts: true },
    where: { id: userId },
    update: {},
    create: {
      id: page.id,
      name: page.name,
      flipnotes: {
        create: page.flipnoteIds.map((id) => ({ id })),
      },
      starCounts: {
        create: ['yellow', 'green', 'red', 'blue', 'purple'].map((c, idx) => ({
          type: c,
          count: page.stars[idx],
        })),
      },
    },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    flipnotes: newUser.flipnotes.length,
    starCounts: newUser.starCounts.map((sc) => sc.count),
  };
}