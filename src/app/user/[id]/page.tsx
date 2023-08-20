import React from 'react'

import Portfolio from '@/app/_components/portfolio';
import { prisma } from '@/app/_server/db';

// TODO: Fix so that flipnotes not fetched initially?
// TODO: Move behavior into route
const fetchUser = async (id: string) => {
  const user = await prisma.user
    .findUnique({ where: { id } })

  if (!user) throw new Error('Failed to load user')

  return user
}

type UserProfileProps = {
  params: { id: string }
}

const UserHeader = ({ id, userName }: { id: string, userName: string }) => {
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
      <div className='p-4 bg-white'>
        <div className='space-x-2'>
          <button className='text-main-offline'>Grid View</button>
          <button>Full Screen View</button>
        </div>
      </div>
    </header>
  );
  
}

const UserProfile = async ({ params }: UserProfileProps) => {
  const user = await fetchUser(params.id)
  console.log(user)

  return (
    <main className='w-full h-full px-16 pt-24'>
      <UserHeader id={params.id} userName={user.name} />
      <Portfolio {...{ user }} />
    </main>
  )
}

export default UserProfile 
