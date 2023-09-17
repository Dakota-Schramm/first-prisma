'use client';

import { User } from '@prisma/client';

import { Flipnote } from '@/app/_components/flipnote';
import FeedSelector from './feed-selector';
import useFeed from '@/hooks/useFeed';
import { useAnalytics } from './_hooks/useAnalytics';
import { useFlipnotes } from './_hooks/useFlipnotes';

export const BulletinBoard = () => {
  const { feedData, handleFeedTypeChange } = useFeed();
  const { type, users, userCount, favoriteCount } = feedData;
  const {flipnotes, handleGetNextFlipnotes} = useFlipnotes(users);
  const { analytics, setAnalytics } = useAnalytics(flipnotes);

  return <>
    <FeedSelector
      feedType={type}
      setFeedType={(t) => handleFeedTypeChange(t)}
      {...{ userCount, favoriteCount }}
    />
    <section className='flex flex-col items-center justify-between min-h-screen p-24'>
      {flipnotes.length
        ? flipnotes.map(({ id, userId }, idx) => (
          <Flipnote
            key={id}
            isLast={idx === flipnotes.length - 1}
            userName={getUserName(users, userId)}
            {...{ id, userId, handleGetNextFlipnotes }}
          />
        )) : null }
    </section>
  </>
};

function getUserName(users: User[], userId: string) {
  const user = users?.find((user) => user.id === userId);

  return user?.name;
}
