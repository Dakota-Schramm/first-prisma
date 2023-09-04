// @ts-ignore
import { PrismaClient } from '@prisma/client';

import { scrapeUserPage } from '@/app/api/users/[id]/puppeteer';
import { userStudioIds } from '../src/app/_utils/constants';
import log from '@/app/_utils/log';

const prisma = new PrismaClient();

async function main() {
  const userRequests = userStudioIds.map(async (id) => {
    const user = await upsertUser(id);
    return user
  })
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
    where: { id: userId },
    update: {},
    create: {
      id: page.id,
      name: page.name,
      flipnotes: {
        create: page.flipnoteIds.map(id => ({ id }))
      }
    }
  });

  return newUser
}