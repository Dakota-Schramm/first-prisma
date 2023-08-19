// @ts-ignore
import { PrismaClient } from '@prisma/client';

import { scrapeUserPage } from '../src/app/_lib/getFlipnoteIdsForUser';
import { userStudioIds } from '../src/app/_utils/constants';

const prisma = new PrismaClient();

async function main() {
  const [gizmoId, fredId, epicguitarId] = userStudioIds

  const gizmoPage = await scrapeUserPage(gizmoId);
  const fredPage = await scrapeUserPage(fredId);
  const epicguitarPage = await scrapeUserPage(epicguitarId);
  
  const gizmo = await prisma.user.upsert({
    where: { id: gizmoId },
    update: {},
    create: {
      id: gizmoPage.id,
      name: gizmoPage.name,
      flipnoteTotal: gizmoPage.flipnoteTotal,
      flipnotes: {
        create: gizmoPage.flipnoteIds.map(id => ({ id }))
      }
    }
  });

  // const boss = await prisma.user.upsert({
  //   where: { id: ""},
  //   update: {},
  //   create: {
  //     id: "",
  //     name: 'boss',
  //     flipnoteTotal: 92,
  //     flipnotes: {
  //       create: {}
  //     }
  //   }
  // });

  const fred = await prisma.user.upsert({
    where: { id: fredId },
    update: {},
    create: {
      id: fredPage.id,
      name: fredPage.name,
      flipnoteTotal: fredPage.flipnoteTotal,
      flipnotes: {
        create: fredPage.flipnoteIds.map(id => ({ id }))
      }
    }
  });


  // const anthony = await prisma.user.upsert({
  //   where: { studioId: "56650B50CC783E17"},
  //   update: {},
  //   create: {
  //     id: "56650B50CC783E17",
  //     name: 'Gizmo',
  //     flipnoteTotal: 92,
  //     flipnotes: {
  //       create: {}
  //     }
  //   }
  // });

  const epicguitar = await prisma.user.upsert({
    where: { id: epicguitarId },
    update: {},
    create: {
      id: epicguitarPage.id,
      name: epicguitarPage.name,
      flipnoteTotal: epicguitarPage.flipnoteTotal,
      flipnotes: {
        create: epicguitarPage.flipnoteIds.map(id => ({ id }))
      }
    }
  });

  console.log(gizmo, fred, epicguitar);
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
