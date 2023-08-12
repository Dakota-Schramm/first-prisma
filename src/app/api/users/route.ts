import { NextResponse } from 'next/server';
import { Prisma, PrismaClient, User } from '@prisma/client';

export async function GET() {
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

