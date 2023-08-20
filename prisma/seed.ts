// @ts-ignore
import { PrismaClient } from '@prisma/client';

import { scrapeUserPage } from '../src/app/_lib/getFlipnoteIdsForUser';
import { userStudioIds } from '../src/app/_utils/constants';

const prisma = new PrismaClient();

async function main() {
  const userRequests = userStudioIds.map(async (id) => {
    const user = await upsertUser(id);
    return user
  })
  const users = await Promise.all(userRequests);

  console.log(users);
}

main()
  .then(async () => {
    console.log('Shutting down seed script...')
    await prisma.$disconnect();
    process.exit()
  })
  .catch(async (e) => {
    console.error(e);
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
      flipnoteTotal: page.flipnoteTotal,
      flipnotes: {
        create: page.flipnoteIds.map(id => ({ id }))
      }
    }
  });

  return newUser
}