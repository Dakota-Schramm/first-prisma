import React from 'react';

import frog from '@/assets/images/frog.webp';
import person from '@/assets/images/person.svg';
import star from '@/assets/images/star.svg';
import question_mark from '@/assets/images/question-mark.svg';
import Image from 'next/image';

console.log(frog);

const FeedSelector = ({ feedType, feedSelector }) => {
  return (
    <section className='absolute flex items-center justify-center p-2 bg-gray-100 rounded-lg'>
      {['all', 'following', 'random'].map((type) => {
        console.log(type);
        switch (type) {
          case 'all':
            return (
              <section key={type}>
                <Image
                  src={frog.src}
                  width={40}
                  height={40}
                  alt='Hatena frog'
                />
              </section>
            );
          case 'following':
            return (
              <section key={type} className='relative'>
                <Image src={person.src} width={40} height={40} alt='Person' />
                <Image
                  className='absolute bottom-1 right-1 filter-star-yellow'
                  src={star.src}
                  width={16}
                  height={16}
                  alt='Favorited'
                />
              </section>
            );
          case 'random':
            return (
              <section key={type} className='relative'>
                <Image src={person.src} width={40} height={40} alt='Person' />
                <Image
                  className='absolute bottom-1 right-1 filter-question-blue'
                  src={question_mark.src}
                  width={16}
                  height={16}
                  alt='Random'
                />
              </section>
            );
          default:
            throw new Error('Invalid feed type');
        }
      })}
    </section>
  );
};

export default FeedSelector;
