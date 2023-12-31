'use client';

import React from 'react';
import Image from 'next/image';
import { LayoutGroup, motion } from 'framer-motion';
import classNames from 'classnames';

import frog from '@/assets/images/frog.webp';
import person from '@/assets/images/person.svg';
import star from '@/assets/images/star.svg';
import question_mark from '@/assets/images/question-mark.svg';

const SelectedSelector = ({ isSelected }) => {
  if (!isSelected) return null
  return <motion.div
    className='absolute inset-0 w-full h-full bg-main-online'
    layout
    layoutId='selected'
  />
}

const HatenaIcon = ({ type, isSelected, onClick}) => (
  <section key={type} className='relative'>
    <button
      key={type}
      id={`feed-${type}`}
      className='relative z-10'
      {...{ onClick }}
    >
      <Image
        src={frog.src}
        width={40}
        height={40}
        alt='Hatena frog'
      />
    </button>
    <SelectedSelector {...{ isSelected }} />
  </section>
)

const RandomIcon = ({ type, isSelected, onClick}) => (
  <section key={type} className='relative'>
    <button
      key={type}
      id={`feed-${type}`}
      className={classNames(
        'relative z-10',
        'after:w-fit after:h-3 after:bg-red-500 after:absolute after:top-0 after:right-0 after:rounded-full after:text-white after:text-xs after:leading-3 after:justify-center after:items-center after:flex after:flex after:p-1'
      )}
      {...{ onClick }}
    >
      <Image
        src={person.src}
        width={40}
        height={40}
        alt='Person'
      />
      <Image
        className='absolute bottom-1 right-1 filter-question-blue'
        src={question_mark.src}
        width={16}
        height={16}
        alt='Random'
      />
    </button>
    <SelectedSelector {...{ isSelected }} />
  </section>
)

const FavoritesIcon = ({ favoritesPresent, type, onClick, isSelected}) => {
  if (!favoritesPresent) return null;

  return <section key={type} className='relative'>
    <button
      key={type}
      id={`feed-${type}`}
      className={classNames(
        'relative z-10',
        'after:w-fit after:h-3 after:bg-red-500 after:absolute after:top-0 after:right-0 after:rounded-full after:text-white after:text-xs after:leading-3 after:justify-center after:items-center after:flex after:flex after:p-1'
      )}
      {...{ onClick }}
    >
      <Image
        src={person.src}
        width={40}
        height={40}
        alt='Person'
        className='after:w-2 after:h-2 after:bg-red-500 after:absolute after:top-0 after:right-0 after:rounded-lg'
      />
      <Image
        className='absolute bottom-1 right-1 filter-star-yellow'
        src={star.src}
        width={16}
        height={16}
        alt='Favorited'
      />
    </button>
    <SelectedSelector {...{ isSelected }} />
  </section>
}

type FeedSelectorProps = {
  feedType: string;
  setFeedType: (feedType: string) => void;
  userCount: number;
  favoriteCount: number;
};

const FeedSelector = ({
  feedType,
  setFeedType,
  userCount,
  favoriteCount,
}: FeedSelectorProps) => {
  const favoritesPresent = 1 <= favoriteCount;

  function onClick(type) { setFeedType(type); }

  // TODO: Break up render into multiple components
  return <>
    <nav className='absolute flex items-center justify-center p-2 bg-gray-100 rounded-lg'>
      {['hatena', 'favorites', 'random'].map((type) => {
        const isSelected = feedType == type;
        switch (type) {
          case 'hatena': return <HatenaIcon {...{ type, isSelected, onClick }} />
          case 'favorites': return <FavoritesIcon {...{ favoritesPresent, type, isSelected, onClick }} /> 
          case 'random': return <RandomIcon {...{ type, isSelected, onClick }} />
          default: throw new Error(`Invalid feed type: ${type}`);
        }
      })}
    </nav>
    <style>{`
      button#feed-favorites::after {
        content: "${favoriteCount}";
      }

      button#feed-random::after {
        content: "${userCount}";
      }
    `}</style>
  </>
};

export default FeedSelector;
