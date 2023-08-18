'use client'

import React, { useEffect, useState } from 'react';

import log from '@/app/_utils/log';
import useWindowIntersection from '../../_hooks/useWindowIntersection';
import LoadingFrog from '../loading-frog';
import frog from './frog.png';

const BASE_URL = "https://archive.sudomemo.net/watch/embed"

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
const Flipnote = ({ id, userName, isLast, handleGetNextFlipnotes }:
  { id: string, userName: string, isLast: boolean, handleGetNextFlipnotes: () => void }
) => {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ detailsRef, isVisible ] = useWindowIntersection()

  useEffect(() => {
    if (!isVisible || !isLast) return
    handleGetNextFlipnotes()
  }, [isVisible])

  return (
    <details
      className='p-4 my-4 text-black bg-white border border-black border-solid'
      // open={}
      ref={detailsRef}
    >
      <summary className='text-xl font-bold'>
        Flipnote by {userName}
      </summary>
      <div className='w-[512px] h-[429px]'>
        { !isLoaded && <LoadScreen /> }
        <iframe
          key={id}
          src={`${BASE_URL}/${id}`}
          onLoad={() => {
            setIsLoaded(true)
            log(`Flipnote ${id} loaded`)
          }}
          loading='lazy' // used to instruct the browser to defer loading of images/iframes that are off-screen until the user scrolls near them.
          allowFullScreen
          scrolling='no'
          frameBorder={0}
          height={429}
          width={512} 
        />
      </div>
    </details>
  );
}

// TODO: Memoize?
const LoadScreen = () => {
  return (
    <section className='flex items-end justify-end w-full h-full'>
      <LoadingFrog image={frog} />
    </section> 
  )
}

export default Flipnote