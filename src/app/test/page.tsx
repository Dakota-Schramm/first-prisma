import getFlipnoteIdsForUser from '@/utils/getFlipnoteIdsForUser'

async function getData() {
  const ids = await getFlipnoteIdsForUser('test')
  console.log(ids)

  return ids;
}

const BASE_URL = "https://archive.sudomemo.net/watch/embed"

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

          return (
            <iframe key={id} src={`${BASE_URL}/${id}`}
              scrolling='no' frameBorder={0} height={429} width={512}
            />
          )
        })
      }
    </main>
  )
}