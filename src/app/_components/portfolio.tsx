'use client'

import Image from 'next/image';
import React, { useEffect } from 'react'
import { User } from '@prisma/client';

import { useFlipnotes } from '@/app/_hooks/useFlipnotes';
import { IFRAME_BASE_URL as BASE_URL } from '@/app/_utils/constants';
import plus from '@/assets/images/plus.svg'

const Flipnote = ({ id }: { id: string }) => {
  return (
    <iframe
      key={id}
      src={`${BASE_URL}/${id}`}
      // onLoad={() => {
      //   setIsLoaded(true);
      //   log(`Flipnote ${id} loaded`);
      // }}
      loading='lazy' // used to instruct the browser to defer loading of images/iframes that are off-screen until the user scrolls near them.
      allowFullScreen
      scrolling='no'
      frameBorder={0}
      height={429}
      width={512}
    />
  )
}

const Portfolio = ({ user }: { user: User }) => {
  const { flipnotes, handleGetNextFlipnotes } = useFlipnotes([user])

  useEffect(() => {
    handleGetNextFlipnotes();
  }, []);

  // TODO: Remove margin from element in last column
  return (
    <>
      <section className='grid items-center justify-center grid-cols-3 gap-4 p-4'>
        { flipnotes.map(
          (f) => {
            const { id } = f
            return (
              <Flipnote
                key={id}
                {...{ id }} 
              /> 
            )
          }
        )}
      </section>
      <footer className='flex items-center justify-center w-full h-20'>
        <button onClick={handleGetNextFlipnotes}>
          <Image src={plus} alt='Expand flipnotes' />
        </button>
      </footer>
    </>
  )
}

export default Portfolio
