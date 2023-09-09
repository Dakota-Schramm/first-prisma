import { NextRequest, NextResponse } from 'next/server';
import { User, Flipnote } from '@prisma/client';

import { prisma } from '@/app/api/db';
import log from '@/app/_utils/log';

const FLIPNOTES_TO_ADD = 3;

// Key: userId
// Value: flipnoteId of last record accessed
type FlipnoteCursors = {
  [key: string]: string;
};

// GETs next batch of flipnotes using cursor-based pagination
// TODO:
// Add query params for number to return
export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (id.length !== 16) return NextResponse.error();

  let user: User;
  let flipnotes: Flipnote[] = [];
  let cursor = request.nextUrl.searchParams.get('cursor') ?? undefined;

  try {
    user = await prisma.user.findUnique({ where: { id } });

    if (!user) throw new Error('User not found');

    const flipnotesToAdd = await prisma.flipnote.findMany({
      where: { userId: user.id },
      skip: cursor ? 1 : 0,
      take: FLIPNOTES_TO_ADD,
      cursor: cursor ? { id: cursor } : undefined,
    });

    cursor = flipnotesToAdd.at(-1)?.id;

    flipnotes = [...flipnotes, ...flipnotesToAdd.flat()];
  } catch (e) {
    log.error(e);
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json({ flipnotes, cursor });
}
