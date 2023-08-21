import { User } from '@prisma/client';

import { BulletinBoard } from './bulletin-board';
import { storageAvailable } from '../_lib/storageAvailable';

// TODO: Get fonts from sudomemo site
// TODO: Get colors from sudomemo site
// TODO: Figure out if can invaldate using a hook?

export const revalidate = 60

async function fetchUsers() {
  let feed: User[] | undefined
  (() => {
    if (!storageAvailable("localStorage")) return
  
    const favoritesJsonString = localStorage.getItem('favorites')
    if (!favoritesJsonString) return

    const res = JSON.parse(favoritesJsonString)
    const data = res.data
    console.log(": ", localStorage, data)

    if (data.users.length === 0) return

    // Get users using ids from favorites
    // feed = ...
  })();

  if (!feed) feed = await fetchDefaultFeed()
  return feed
}

// TODO: Add error handling for when user has
// no additional flipnotes to display
export default async function Feed() {
  const users = await fetchUsers()
  if (!users) throw new Error('Users failed to load')

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24 ">
      <BulletinBoard users={users} />
    </main>
  )
}

async function fetchDefaultFeed() {
  const res = await fetch(`${process.env.URL}/api/users`)
  const data = await res.json()

  return data.users
}

