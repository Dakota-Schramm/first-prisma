import React from 'react'

import Portfolio from '@/app/_components/portfolio';

// TODO: Fix so that flipnotes not fetched initially?
const fetchUser = async (id: string) => {
  const res = await fetch(`${process.env.URL}/api/user/${id}`) 
  if (!res.ok) throw new Error('Failed to load flipnotes')

  const data = await res.json()
  return data.user
}

type UserProfileProps = {
  params: { id: string }
}

const UserHeader = ({ id, userName }: { id: string, userName: string }) => {
  return (
    <header className='flex flex-col w-full border-4 border-solid rounded-lg border-gray-50'>
      <div className='flex items-start p-4 space-x-2 bg-main-online'>
        <div className='w-20 h-20 bg-red-500 border border-solid border-gray-50'></div>
        <h1>{`Profile -- ${userName}`}</h1>
        <h2>{id}</h2>
      </div>
      <div className='p-4 bg-white'>
        <div>
          <button>Grid View</button>
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
      <UserHeader id={params.id} userName={user.userName} />
      <Portfolio {...{ user }} />
    </main>
  )
}

export default UserProfile 
