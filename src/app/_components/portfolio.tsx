'use client'

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { User } from '@prisma/client';
import useSWRInfinite from 'swr/infinite';

import { useFlipnotes } from '@/app/_hooks/useFlipnotes';
import { IFRAME_BASE_URL as BASE_URL } from '@/app/_utils/constants';
import plus from '@/assets/images/plus.svg'
import log from '../_utils/log';
import { fetcher } from '../_utils/fetcher';

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
  // const { flipnotes, handleGetNextFlipnotes } = useFlipnotes([user])
  const BATCH_FLIPNOTE_URL = `/api/users/${user.id}/flipnotes`;
  const getKey = (pageIndex, previousPageData) => {
    // reached the end
    if (previousPageData && !previousPageData.flipnotes) return null

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return BATCH_FLIPNOTE_URL

    // add the cursor to the API endpoint
    return `${BATCH_FLIPNOTE_URL}?cursor=${previousPageData.cursor}`
  }
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher)

  if (!data) return <div>Loading...</div>

  const flipnotes = data
    ?.map(response => response?.flipnotes).flat()
    ?? []

  // TODO: Remove margin from element in last column
  return (
    <>
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
        <button onClick={() => setSize(s => s+1)}>
          <Image src={plus} alt='Expand flipnotes' />
        </button>
      </footer>
    </>
  )
}

export default Portfolio
