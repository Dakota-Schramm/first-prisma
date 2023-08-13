import { BulletinBoard } from '../_components/bulletin-board';

// TODO: Get fonts from sudomemo site
export default async function Feed() {
  const users = await fetchUsers()

  if (!users) throw new Error('Users failed to load')

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <BulletinBoard users={users} />
    </main>
  )
}

async function fetchUsers() {
  const res = await fetch(process.env.URL + '/api/users')
  const data = await res.json()

  return data.users
}
