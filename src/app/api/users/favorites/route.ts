import { NextRequest, NextResponse } from 'next/server';
import { Prisma, User } from '@prisma/client';
import { prisma } from '@/app/api/db';
import log from '@/app/_utils/log';

export const revalidate = 30;

// Must pass request object here to prevent caching
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers#opting-out-of-caching
type PostedUser = {
  id: string;
};
export async function POST(request: NextRequest) {
  const res = await request.json();
  const postedUsers: PostedUser[] = res.data;

  let users: User[];
  try {
    // Execute the query using Prisma's queryRaw method
    users = await prisma.$queryRaw`
    SELECT *
    FROM "User"
    WHERE id IN (${Prisma.join(postedUsers)})
  `;
  } catch (e) {
    log.error(e);
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json({ users });
}

