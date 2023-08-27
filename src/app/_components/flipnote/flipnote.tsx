'use client'

import classNames from 'classnames';
import Link from 'next/link'
import React, { useEffect, useState, useContext, useRef } from 'react';

import log from '@/app/_utils/log';
import useWindowIntersection from '@/hooks/useWindowIntersection';
import LoadingFrog from '../loading-frog';
import frog from './frog.png';

import { IFRAME_BASE_URL as BASE_URL } from '@/app/_utils/constants';
import { AnalyticsContext } from '@/app/_contexts/analytics';

// TODO: Fix error here where flipnotes don't lazy load
const FlipnoteContent = ({ flipnoteId, userId }) => {
  const { analytics, setAnalytics } = useContext(AnalyticsContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  // TODO: Move to Bulletin-Board
  useEffect(() => {
    const monitor = setInterval(() => {
      if (hasBeenViewed) return;
      const elem = document.activeElement;
      const elemIsIframe = elem?.tagName === 'IFRAME';
      if (!elemIsIframe) return;
      const [aUId, aFId] = elem.id.split('-');
      console.log({ aUId, aFId });
      setHasBeenViewed(true);
      handleAnalyticsUpdate(aUId, aFId, setAnalytics);
    }, 1000 * 15);
  }, []);

  return (
    <div className='relative'>
      {!isLoaded && <LoadScreen />}
      <iframe
        key={flipnoteId}
        src={`${BASE_URL}/${flipnoteId}`}
        id={`${userId}-${flipnoteId}`}
        onLoad={() => {
          setIsLoaded(true);
          log(`Flipnote ${flipnoteId} loaded`);
        }}
        loading='lazy' // used to instruct the browser to defer loading of images/iframes that are off-screen until the user scrolls near them.
        allowFullScreen
        scrolling='no'
        frameBorder={0}
        height={429}
        width={512}
      />
    </div>
  );
};

function handleAnalyticsUpdate(userId: string, flipnoteId: string, update) {
  update((prevUsers) => {
    console.log(prevUsers);
    log(`Analytics updated for user ${userId}`);
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

type FlipnoteProps = {
  id: string;
  userId: string;
  userName: string;
  isLast: boolean;
  handleGetNextFlipnotes: () => void;
};

// TODO: Add styles for child elements when details is open
// TODO: Use postit note design:
// https://webdesign.tutsplus.com/create-a-sticky-note-effect-in-5-easy-steps-with-css3-and-html5--net-13934t
// Also: not sure if this is the best solution for this:
// maybe see if can lazy load based on when details is opened
// for first time
// TODO: Fix loading issue on throttled version --
// Doesn't stay on loading screen for full time
// its loading -- instead, shows iframe with its own
// respective loading animation
const Flipnote = ({
  id,
  userId,
  userName,
  isLast,
  handleGetNextFlipnotes,
}: FlipnoteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [detailsRef, isVisible] = useWindowIntersection();

  useEffect(() => {
    if (!isVisible || !isLast) return;
    handleGetNextFlipnotes();
  }, [isVisible]);

  return (
    <details
      ref={detailsRef}
      className={classNames(
        'my-4 text-black bg-white border border-black border-solid w-[512px] h-full flex flex-col items-center justify-center',
        { 'p-0': isOpen },
        { 'p-4': !isOpen }
      )}
      open={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <summary
        className={classNames(
          'text-xl font-bold',
          { 'p-0': !isOpen },
          { 'p-4': isOpen }
        )}
      >
        Flipnote by{' '}
        <Link
          href={`/users/${userId}`}
          className='underline hover:text-main-offline'
        >
          {userName}
        </Link>
      </summary>
      <FlipnoteContent {...{ flipnoteId: id, userId }} />
    </details>
  );
};

// TODO: Memoize?
// TODO: Fix styling so that loading from is in bottom right
const LoadScreen = () => {
  return (
    <div className='absolute bottom-2 right-2'>
      <LoadingFrog image={frog} />
    </div> 
  )
}

export default Flipnote
