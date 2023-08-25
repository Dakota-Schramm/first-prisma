import { User } from '@prisma/client';

import { BulletinBoard } from './bulletin-board';

// TODO: Get fonts from sudomemo site
// TODO: Get colors from sudomemo site
// TODO: Figure out if can invaldate using a hook?

export const revalidate = 60;

// TODO: Add error handling for when user has
// no additional flipnotes to display
export default async function Feed() {
  return (
    <main className='flex flex-col items-center justify-between min-h-screen p-24 '>
      <BulletinBoard />
    </main>
  );
}

