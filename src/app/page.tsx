import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getData() {
  const allUsers = await prisma.user.findMany()

  return allUsers;
}

export default async function Home() {
  let data = [];
  try { 
    data = await getData()
  } catch (error) {
    // This will activate the closest `error.js` Error Boundary
    console.error(error)
    throw new Error('Failed to fetch data')
  } finally { await prisma.$disconnect() }
  

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      {data.map((user) => (
        <div key={user.id} className="flex flex-col items-center justify-center w-full h-64 p-8 my-8 text-black bg-white rounded shadow">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p className="text-xl">{user.email}</p>
        </div>
      ))}
    </main>
  )
}
