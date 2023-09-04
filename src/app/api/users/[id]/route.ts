import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation'
import { Prisma } from '@prisma/client';

import { prisma } from '@/app/api/db'; // Partial import to allow for seed script
import { scrapeUserPage } from '@/app/api/users/[id]/puppeteer';
import log from '@/app/_utils/log';

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (id.length !== 16) return NextResponse.error();
  let user = await getOrCreateFullUser(id);

  if (!user) notFound();
  return NextResponse.json({ user });
}

const userInclude = {
  id: true,
  name: true,
  flipnotes: {
    id: true,
    userId: false,
  },
} satisfies Prisma.UserInclude;

type MyPostPayload = Prisma.UserGetPayload<{ include: typeof userInclude }>;

export async function getOrCreateFullUser(userId: string) {
  let user: MyPostPayload | null = null;
  if (userId.length !== 16) {
    throw new Error('Invalid user id: length is not 16 characters');
  }

  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: { flipnotes: true },
    });

    if (!user) {
      const scrapedUser = await scrapeUserPage(userId);
      log.debug({ scrapedUser });
      user = await prisma.user.create({
        data: {
          id: scrapedUser.id,
          name: scrapedUser.name,
          flipnotes: {
            createMany: {
              data: scrapedUser.flipnoteIds.map((id) => ({ id })),
            },
          },
        },
        include: { flipnotes: true },
      });

      if (!user) return null;
    }
    return {
      id: user.id,
      userName: user.name,
      flipnotes: user.flipnotes,
    };
  } catch (e: any) {
    throw new Error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}
