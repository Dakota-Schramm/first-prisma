import { NextRequest, NextResponse } from 'next/server';
import { User } from '@prisma/client';
import { prisma } from '@/app/api/db';
import log from '@/app/_utils/log';

export const revalidate = 30;

// Must pass request object here to prevent caching
// https://nextjs.org/docs/app/building-your-application/routing/route-handlers#opting-out-of-caching
export async function GET(request: NextRequest) {
  let users: User[] = [];

  try {
    users  = await prisma.user 
      .findMany()
  } catch (e) {
    log.error(e)
  } finally { await prisma.$disconnect() }

  return NextResponse.json({ users });
}

