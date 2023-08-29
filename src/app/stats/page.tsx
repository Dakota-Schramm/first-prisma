import { prisma } from '@/app/api/db';

// TODO: Add sorting based on star numbers
async function getData() {
  // Get star counts for all loaded users
  // Get flipnote counts for all loaded users
  const usersWithRelationCounts = await prisma.user.findMany({
    include: {
      starCounts: true,
      _count: {
        select: { flipnotes: true },
      },
    },
  });
  const getTotalStarCount = () => {
    let total = 0;
    usersWithRelationCounts.forEach((user) => {
      total += user.starCounts.reduce(
        (acc, starCount) => acc + starCount.count,
        0
      );
    });
    return total;
  };
  const totalFlipnoteCount = usersWithRelationCounts.reduce(
    (acc, user) => acc + user._count.flipnotes,
    0
  );

  return {
    users: usersWithRelationCounts,
    totalStarCount: getTotalStarCount(),
    totalFlipnoteCount,
  };
}

export default async function Home() {
  let data = {};
  try {
    data = await getData();
  } catch (error) {
    // This will activate the closest `error.js` Error Boundary
    console.error(error);
    throw new Error('Failed to fetch data');
  } finally {
    await prisma.$disconnect();
  }

  console.log(data);
  const { totalStarCount, totalFlipnoteCount, users } = data;

  return (
    <main className='grid items-center justify-center w-screen h-screen grid-cols-4 grid-rows-6 p-4 m-4 text-black bg-white rounded-lg'>
      <h1 className='col-span-4 row-span-2'>Stats</h1>
      <section className='row-span-4'>
        <p>Total stars: {totalStarCount}</p>
        <p>Total flipnotes: {totalFlipnoteCount}</p>
        <p>Total users: {users.length}</p>
      </section>
      <section>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className='flex items-center justify-center text-black bg-white rounded shadow'
            >
              <h1 className='text-xl font-bold'>{user.name}</h1>
              <p className='text-xl'>{user.id}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
