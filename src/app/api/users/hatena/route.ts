import { NextResponse } from 'next/server';
import { Prisma, User } from '@prisma/client';
import { prisma } from '@/app/api/db';
import { userHatenaIds } from '@/app/_utils/constants';

export async function GET() {
  let users: User[];
  try {
    // Execute the query using Prisma's queryRaw method
    users = await prisma.$queryRaw`
      SELECT *
      FROM "User"
      WHERE id IN (${Prisma.join(userHatenaIds)})
    `;
  } catch (e) {
    console.log(e);
  } finally {
    await prisma.$disconnect();
  }

  return NextResponse.json({ users });
}
