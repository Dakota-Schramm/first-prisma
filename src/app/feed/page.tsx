import { BulletinBoard } from '@/components/bulletin-board';

// TODO: Get fonts from sudomemo site
// TODO: Get colors from sudomemo site
// TODO: Figure out if can invaldate using a hook?
async function fetchUsers() {
  const res = await fetch(`${process.env.URL}/api/users`, {
    next: { revalidate: 60 } // figure out if using this one or one defined in route
  })
  const data = await res.json()

  return data.users
}

// TODO: Add error handling for when user has
// no additional flipnotes to display
export default async function Feed() {
  const users = await fetchUsers()

  if (!users) throw new Error('Users failed to load')

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24 backdrop:bg-blue bg-main-online">
      <BulletinBoard users={users} />
    </main>
  )
}

