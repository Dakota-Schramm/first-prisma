import useSWRInfinite from 'swr/infinite';
import { User } from '@prisma/client';

const BATCH_FLIPNOTE_URL = (userId: User['id']) =>  `/api/users/${userId}/flipnotes`;
function arrayFetcher(urlArr) {
  const f = (u) => fetch(u).then((r) => r.json());
  return Promise.all(urlArr.map(f));
}

export function useFlipnotes(users) {
  const getKey = (pageIndex, previousPageData) => {
    // reached the end
    if (previousPageData && !previousPageData.at(-1).flipnotes) return null

    let userUrls = {};
    users.forEach((u) => {
      userUrls[u.id] = BATCH_FLIPNOTE_URL(u.id);
    })

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return Object.values(userUrls)

    previousPageData.map(response => {
      const userId = response?.flipnotes[0]?.userId;
      userUrls[userId] = `${BATCH_FLIPNOTE_URL(userId)}?cursor=${response.cursor}`;
    })
    // add the cursor to the API endpoint
    return Object.values(userUrls)
  }

  // Seems like useSWRInfinite is not working as expected with array arguments
  const { data, size, setSize } = useSWRInfinite(getKey, arrayFetcher)

  let flipnotes = [];
  data?.forEach(page => {
    const newPage = page
      ?.map(response=> response?.flipnotes)
      .flat();
    flipnotes = flipnotes.concat(newPage);
  })

  return {
    flipnotes,
    handleGetNextFlipnotes: () => setSize(size + 1)
  }
}
