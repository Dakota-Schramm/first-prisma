'use client'

import React, { useState } from 'react'

import log from '@/app/_utils/log';

const BASE_URL = "https://archive.sudomemo.net/watch/embed"

// TODO: Add styles for child elements when details is open
// TODO: Use postit note design:
// https://webdesign.tutsplus.com/create-a-sticky-note-effect-in-5-easy-steps-with-css3-and-html5--net-13934t
// Also: not sure if this is the best solution for this:
// maybe see if can lazy load based on when details is opened
// for first time
const Flipnote = ({ id, userName }: { id: string, userName: string }) => {
  const [ isLoaded, setIsLoaded ] = useState(false)

  // When the details is opened for the first time,
  // we want to start loading the iframe
  // Once the iframe is loaded, we can set isLoaded to true
  
  
  function onLoad() {
    setIsLoaded(true)
    log(`Flipnote ${id} loaded`)
  }

  return (
    <details
      className='p-4 my-4 text-black bg-white border border-black border-solid'
      // open={}
    >
      <summary className='text-xl font-bold'>
        Flipnote {id} by {userName}
      </summary>
      {!isLoaded && <p>Loading...</p>}
      <div className='w-80'>
        <iframe
          key={id}
          src={`${BASE_URL}/${id}`}
          onLoad={onLoad}
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

export default Flipnote
