import React from 'react'

import Portfolio from '@/app/_components/portfolio';
import { prisma } from '@/app/api/db';

// TODO: Fix so that flipnotes not fetched initially?
// TODO: Move behavior into route
const fetchProfile = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  const flipnoteCount = await prisma.flipnote.aggregate({
    _count: true,
    where: { userId: id },
  });

  return {
    user,
    flipnoteCount: flipnoteCount?._count,
  };
};

type UserProfileProps = {
  params: { id: string };
};

type UserHeaderProps = {
  id: string;
  userName: string;
  flipnoteCount: number;
};

const UserHeader = ({ id, userName, flipnoteCount }: UserHeaderProps) => {
  return (
    <header className='flex flex-col w-full border-4 border-solid rounded-lg border-gray-50'>
      <div className='flex items-start p-4 space-x-2 bg-main-online'>
        <div className='w-20 h-20 bg-red-500 border border-solid border-gray-50'></div>
        <h1>
          {`Profile -- `}
          <span className='underline bold text-main-offline'>{userName}</span>
        </h1>
        <h2 className='italic font-semibold opacity-50'>{`Studio ID: ${id}`}</h2>
      </div>
      <div className='flex justify-between w-full p-4 bg-white'>
        <div className='space-x-2'>
          <button className='text-main-offline'>Grid View</button>
          <button>Full Screen View</button>
        </div>
        <div>
          <p className='text-main-offline'>{`${flipnoteCount} Flipnotes`}</p>
        </div>
      </div>
    </header>
  );
};

const UserProfile = async ({ params }: UserProfileProps) => {
  const { id } = params;
  const { user, flipnoteCount } = await fetchProfile(id);

  if (!user) throw new Error('Failed to load user');

  return (
    <main className='w-full h-full px-16 pt-24'>
      <UserHeader userName={user.name} {...{ id, flipnoteCount }} />
      <Portfolio {...{ user }} />
    </main>
  );
};

export default UserProfile 
