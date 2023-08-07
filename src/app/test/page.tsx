import Flipnote from '@/components/flipnote'
import getFlipnoteIdsForUser from '@/utils/getFlipnoteIdsForUser'

// Keep consistent with flipnote.tsx
const USER = 'test'

async function getData() {
  // TODO: Change this to use DB
  // For function, will use getFlipnoteIdsForUser if 
  // user has not been populated into DB yet
  const ids = await getFlipnoteIdsForUser(USER)
  console.log(ids)

  return ids;
}

// TODO: Get fonts from sudomemo site
export default async function Home() {
  let data; 
  try { 
    data = await getData()
  } catch (error) {
    // This will activate the closest `error.js` Error Boundary
    console.error(error)
    throw new Error('Failed to fetch data')
  }

  if (!data) return <main>Test</main>

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      {
        data.map((id, idx) => {
          if (idx > 5) return null;

          return <Flipnote key={id} id={id} />
        })
      }
    </main>
  )
}