import { NextResponse } from 'next/server';
import { Prisma, PrismaClient, Flipnote } from '@prisma/client';

const FLIPNOTES_TO_ADD = 3

// Key: userId
// Value: flipnoteId of last record accessed
type FlipnoteCursors = {
  [key: string]: string;
}

export async function POST(request: Request, 
  { params: { id } }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  let user;
  let flipnotes: Flipnote[] = [];
  let { cursor } = await request.json();

  try {
    user  = await prisma.user 
      .findUnique({ where: { id } })

    if (!user) throw new Error('User not found')

    const flipnotesToAdd = await prisma.flipnote.findMany({
      where: { userId: user.id },
      skip: 1,
      take: FLIPNOTES_TO_ADD,
      cursor: cursor ? { id: cursor } : undefined,
    })

    cursor = flipnotesToAdd[flipnotesToAdd.length - 1].id

    flipnotes = [...flipnotes, ...flipnotesToAdd.flat()]
  } catch (e) {
    console.log(e)
  } finally { await prisma.$disconnect() }

  return NextResponse.json({ flipnotes, cursor });

}

