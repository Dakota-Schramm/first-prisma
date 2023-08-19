import { NextRequest, NextResponse } from 'next/server';
import { Prisma, PrismaClient, User } from '@prisma/client';

export const revalidate = 30;

// Must pass request object here to prevent caching
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers#opting-out-of-caching
export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  let users: User[] = [];

  try {
    users  = await prisma.user 
      .findMany()
  } catch (e) {
    console.log(e)
  } finally { await prisma.$disconnect() }

  return NextResponse.json({ users });
}

