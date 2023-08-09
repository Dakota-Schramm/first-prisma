'use client'

import React, { useState } from 'react'

import useWindowIntersection from '@/app/_hooks/useWindowIntersection'
import log from '@/app/_utils/log';

const BASE_URL = "https://archive.sudomemo.net/watch/embed"

// Keep consistent with test/page.tsx
const USER = 'test'

// TODO: Add styles for child elements when details is open
// TODO: Use postit note design:
// https://webdesign.tutsplus.com/create-a-sticky-note-effect-in-5-easy-steps-with-css3-and-html5--net-13934t
// Also: not sure if this is the best solution for this:
// maybe see if can lazy load based on when details is opened
// for first time
const Flipnote = ({ id }: { id: string }) => {
  const [ ref, isVisible ] = useWindowIntersection()
  const [ isLoaded, setIsLoaded ] = useState(false)

  const FLIPNOTE_VIDEO_SHOWN = isLoaded || !isVisible;

  return (
    <details
      className='p-4 my-4 text-black bg-white border border-black border-solid'
      // open={}
      onToggle={() => {
        if (!isLoaded) {
          setIsLoaded(true)
          log(`Flipnote ${id} loaded`)
        }
      }}
    >
      <summary className='text-xl font-bold'>
        Flipnote {id} by {USER}
      </summary>
      <section ref={ref}>
        <FlipnoteVideo id={id} isLoaded={FLIPNOTE_VIDEO_SHOWN} />
      </section>
    </details>
  );
}

function FlipnoteVideo({ id, isLoaded }: { 
  id: string, isLoaded: boolean 
}) {
  if (!isLoaded) return <p>Loading...</p>;

  return (
    <iframe
      key={id}
      src={`${BASE_URL}/${id}`}
      loading='lazy' // used to instruct the browser to defer loading of images/iframes that are off-screen until the user scrolls near them.
      allowFullScreen
      scrolling='no'
      frameBorder={0}
      height={429}
      width={512} />
  );
}


export default Flipnote