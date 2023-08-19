import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation'

import { getUserWithFlipnotes } from '@/app/_lib/getFlipnoteIdsForUser';

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (id.length !== 16) return NextResponse.error()
  let user = await getUserWithFlipnotes(id)

  if (!user) notFound()
  return NextResponse.json({ user });
}
