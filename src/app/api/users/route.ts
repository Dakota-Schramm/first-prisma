import { NextRequest, NextResponse } from 'next/server';
import { User } from '@prisma/client';
import { prisma } from '@/app/_server/db';

export const revalidate = 30;

// Must pass request object here to prevent caching
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers#opting-out-of-caching
export async function GET(request: NextRequest) {
  let users: User[] = [];

  try {
    users  = await prisma.user 
      .findMany()
  } catch (e) {
    console.log(e)
  } finally { await prisma.$disconnect() }

  return NextResponse.json({ users });
}

