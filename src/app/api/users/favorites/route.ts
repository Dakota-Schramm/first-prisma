import { NextRequest, NextResponse } from 'next/server';
import { Prisma, User } from '@prisma/client';
import { prisma } from '@/app/api/db';

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
    console.log(users);
  } catch (e) {
    console.log(e);
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json({ users });
}

