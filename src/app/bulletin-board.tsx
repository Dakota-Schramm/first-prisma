'use client';

import { useState, useEffect, useContext, useCallback } from 'react';
import { User } from '@prisma/client';

import { AnalyticsContext } from '@/app/_contexts/analytics';
import { Flipnote } from '@/app/_components/flipnote';
import FeedSelector from './feed-selector';
import log from '@/app/_utils/log';
import useFeed from '@/hooks/useFeed';
import { useFlipnotes } from '@/hooks/useFlipnotes';

export const BulletinBoard = () => {
  const { feedData, handleFeedTypeChange } = useFeed();
  const { type, users, userCount, favoriteCount } = feedData;
  const { flipnotes, setFlipnotes, flipnoteCursors, handleGetNextFlipnotes } = useFlipnotes(users);

  const [hasBeenViewed, setHasBeenViewed] = useState(
    flipnotes.map((fId) => ({ [fId]: false }))
  );
  const { analytics, setAnalytics } = useContext(AnalyticsContext);

  useEffect(() => {
    console.log("U", { users })
  }, [users])
  

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
        setFeedType={(t) => {
          handleFeedTypeChange(t)
          setFlipnotes([])
          handleGetNextFlipnotes(flipnoteCursors)
        }}
        {...{ userCount, favoriteCount }}
      />
      <section className='flex flex-col items-center justify-between min-h-screen p-24'>
        {flipnotes.map(({ id, userId }, idx) => (
          <Flipnote
            key={id}
            isLast={idx === flipnotes.length - 1}
            userName={getUserName(users, userId)}
            handleGetNextFlipnotes={() => handleGetNextFlipnotes(flipnoteCursors)}
            {...{ id, userId }}
          />
        ))}
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
