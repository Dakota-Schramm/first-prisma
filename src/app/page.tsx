import { User } from '@prisma/client';
import type { Metadata } from 'next';

import { BulletinBoard } from './bulletin-board';
import { SiteTitle } from './_utils/constants';

// TODO: Get fonts from sudomemo site
// TODO: Get colors from sudomemo site
// TODO: Figure out if can invaldate using a hook?

export const revalidate = 60;

export const metadata: Metadata = {
  title: SiteTitle,
  description:
    'A Sudomemo clone for viewing legacy Flipnotes. ' +
    'Built with Next.js, Tailwind CSS, and TypeScript.',
};

// TODO: Add error handling for when user has
// no additional flipnotes to display
export default async function Feed() {
  return (
    <main className='flex flex-col items-center justify-between min-h-screen p-24 '>
      <BulletinBoard />
    </main>
  );
}
