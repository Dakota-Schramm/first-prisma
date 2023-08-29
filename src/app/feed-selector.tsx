'use client';

import React from 'react';
import Image from 'next/image';
import { LayoutGroup, motion } from 'framer-motion';
import classNames from 'classnames';

import frog from '@/assets/images/frog.webp';
import person from '@/assets/images/person.svg';
import star from '@/assets/images/star.svg';
import question_mark from '@/assets/images/question-mark.svg';
import { deserializeFavorites } from './_lib/deserializeLocalStorage';

const FeedSelector = ({ feedType, setFeedType }) => {
  const favorites = deserializeFavorites();
  const favoritesPresent = 1 <= favorites.length;

  return (
    <nav className='absolute flex items-center justify-center p-2 bg-gray-100 rounded-lg'>
      <LayoutGroup>
        {['hatena', 'favorites', 'random'].map((type) => {
          const isSelected = feedType == type;
          switch (type) {
            case 'hatena':
              return (
                <section className='relative'>
                  <button
                    key={type}
                    className='relative z-10'
                    onClick={() => setFeedType(type)}
                  >
                    <Image
                      src={frog.src}
                      width={40}
                      height={40}
                      alt='Hatena frog'
                    />
                  </button>
                  {isSelected && (
                    <motion.div
                      className='absolute inset-0 w-full h-full bg-main-online'
                      layout
                      layoutId='selected'
                    />
                  )}
                </section>
              );
            case 'favorites': {
              if (!favoritesPresent) return;
              return (
                <section className='relative'>
                  <button
                    key={type}
                    className='relative z-10'
                    onClick={() => setFeedType(type)}
                  >
                    <Image
                      src={person.src}
                      width={40}
                      height={40}
                      alt='Person'
                    />
                    <Image
                      className='absolute bottom-1 right-1 filter-star-yellow'
                      src={star.src}
                      width={16}
                      height={16}
                      alt='Favorited'
                    />
                  </button>
                  {isSelected && (
                    <motion.div
                      className='absolute inset-0 w-full h-full bg-main-online'
                      layout
                      layoutId='selected'
                    />
                  )}
                </section>
              );
            }
            case 'random':
              return (
                <section className='relative'>
                  <button
                    key={type}
                    className='relative z-10'
                    onClick={() => setFeedType(type)}
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
                  {isSelected && (
                    <motion.div
                      className='absolute inset-0 w-full h-full bg-main-online'
                      layout
                      layoutId='selected'
                    />
                  )}
                </section>
              );
            default:
              throw new Error(`Invalid feed type: ${type}`);
          }
        })}
      </LayoutGroup>
    </nav>
  );
};

export default FeedSelector;
