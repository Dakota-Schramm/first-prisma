import React from 'react'
import { Metadata } from 'next';
import { StarCounts } from '@prisma/client';

import Portfolio from '@/app/_components/portfolio';
import { prisma } from '@/app/api/db';
import { SiteTitle } from '@/app/_utils/constants';
import log from '@/app/_utils/log';

// TODO: Fix so that flipnotes not fetched initially?
// TODO: Move behavior into route
const fetchProfile = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { starCounts: true },
  });

  const flipnoteCount = await prisma.flipnote.aggregate({
    _count: true,
    where: { userId: id },
  });

  if (!user) throw new Error('Failed to load user');

  return {
    user,
    flipnoteCount: flipnoteCount._count,
  };
};

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const data = await prisma.user.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: data?.name ? `${SiteTitle} | ${data?.name}` : undefined,
  };
}

type UserProfileProps = {
  params: { id: string };
};

export type UserHeaderProps = {
  id: User['id'];
  userName: User['name'];
  flipnoteCount: number;
  starCounts: StarCounts[];
};

const UserHeader = ({
  id,
  userName,
  flipnoteCount,
  starCounts,
}: UserHeaderProps) => {
  log.debug(starCounts);
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
        <div className='flex divide-x-2'>
          <p className='pr-2 text-main-offline'>{`${flipnoteCount} Flipnotes`}</p>
          <ul className='flex pl-2 space-x-2'>
            {starCounts.map((sc) => (
              <li key={sc.id}>
                <span className='text-main-offline'>{`${capitalize(
                  sc.type
                )}`}</span>
                {': '}
                {sc.count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

const UserProfile = async ({ params }: UserProfileProps) => {
  const { user, flipnoteCount } = await fetchProfile(params.id);
  const { name, starCounts } = user;

  log.debug(user);

  return (
    <main className='w-full h-full px-16 pt-24'>
      <UserHeader
        id={params.id}
        userName={name}
        {...{ starCounts, flipnoteCount }}
      />
      <Portfolio {...{ user }} />
    </main>
  );
};

function capitalize(input: string) {
  return input[0].toUpperCase() + input.slice(1);
}

export default UserProfile 
