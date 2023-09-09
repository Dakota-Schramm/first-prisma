'use client';

import { useState, useEffect, useContext } from 'react';
import { User } from '@prisma/client';
import useSWRInfinite from 'swr/infinite';

import { AnalyticsContext } from '@/app/_contexts/analytics';
import { Flipnote } from '@/app/_components/flipnote';
import FeedSelector from './feed-selector';
import useFeed from '@/hooks/useFeed';
import log from '@/app/_utils/log';


const BATCH_FLIPNOTE_URL = (userId: User['id']) =>  `/api/users/${userId}/flipnotes`;
function arrayFetcher(urlArr) {
  const f = (u) => fetch(u).then((r) => r.json());
  return Promise.all(urlArr.map(f));
}


export const BulletinBoard = () => {
  const { feedData, handleFeedTypeChange } = useFeed();
  const { type, users, userCount, favoriteCount } = feedData;
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

  const [hasBeenViewed, setHasBeenViewed] = useState(
    flipnotes.map((fId) => ({ [fId]: false }))
  );
  const { analytics, setAnalytics } = useContext(AnalyticsContext);

  // TODO: Move to Bulletin-Boardn
  useEffect(() => {
    const monitor = setInterval(() => {
      if (hasBeenViewed) return;
      const elem = document.activeElement;
      const elemIsIframe = elem?.tagName === 'IFRAME';
      if (!elemIsIframe) return;
      clearInterval(monitor);
      const [aUId, aFId] = elem.id.split('-');
      log.info({ aUId, aFId });
      setHasBeenViewed((prev) => {
        return { ...{ [aFId]: true }, ...prev };
      });
      handleAnalyticsUpdate(aUId, aFId, setAnalytics);
    }, 1000 * 15);
  }, []);


  return (
    <>
      <FeedSelector
        feedType={type}
        setFeedType={(t) => handleFeedTypeChange(t)}
        {...{ userCount, favoriteCount }}
      />
      <section className='flex flex-col items-center justify-between min-h-screen p-24'>
        {flipnotes && 
          flipnotes.map(({ id, userId }, idx) => (
            <Flipnote
              key={id}
              isLast={idx === flipnotes.length - 1}
              userName={getUserName(users, userId)}
              handleGetNextFlipnotes={() => setSize(s => s + 1)}
              {...{ id, userId }}
            />
          ))
        }
      </section>
    </>
  );
};

function handleAnalyticsUpdate(userId: string, flipnoteId: string, update) {
  update((prevUsers) => {
    log.info(`Analytics updated for user ${userId}`);
    let increment = 1;

    const isNewUser = !(userId in (prevUsers ?? {}));
    const isNewFlipnote =
      isNewUser || !(flipnoteId in (prevUsers[userId] ?? {}));
    let flipnoteToUpdate = !isNewFlipnote
      ? { [flipnoteId]: prevUsers[userId][flipnoteId] + 1 }
      : { [flipnoteId]: 1 };

    let userToUpdate = !isNewUser
      ? { [userId]: { ...flipnoteToUpdate, ...prevUsers[userId] } }
      : { [userId]: { ...flipnoteToUpdate } };

    if (!isNewFlipnote) increment += prevUsers[userId][flipnoteId];

    const updatedUserAnalytics = {
      ...prevUsers,
      ...userToUpdate,
    };

    return updatedUserAnalytics;
  });
}

function getUserName(users: User[], userId: string) {
  const user = users?.find((user) => user.id === userId);

  return user?.name;
}
