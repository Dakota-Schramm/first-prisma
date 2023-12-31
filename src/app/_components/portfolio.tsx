'use client'

import Image from 'next/image';
import React from 'react'
import { User } from '@prisma/client';

import { IFRAME_BASE_URL as BASE_URL } from '@/app/_utils/constants';
import plus from '@/assets/images/plus.svg'
import log from '../_utils/log';
import { useFlipnotes } from '../_hooks';

const Flipnote = ({ id }: { id: string }) => {
  return (
    <iframe
      key={id}
      src={`${BASE_URL}/${id}`}
      onLoad={() => log.info(`Flipnote ${id} loaded`)
      }
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

  if (!flipnotes || flipnotes.length === 0) return <div>Loading...</div>

  // TODO: Remove margin from element in last column
  // TODO: Use container to resize flipnotes at certain screen sizes
  return <>
    <section className='grid items-center justify-center grid-cols-3 gap-4 p-4'>
      {flipnotes.map(
        ({ id }) => (
          <Flipnote
            key={id}
            {...{ id }} 
          /> 
        )
      )}
    </section>
    <footer className='flex items-center justify-center w-full h-20'>
      <button onClick={handleGetNextFlipnotes}>
        <Image src={plus} alt='Expand flipnotes' />
      </button>
    </footer>
  </>
}

export default Portfolio
