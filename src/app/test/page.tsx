import React from 'react'

import LoadingFrog from '@/components/loading-frog';
import frog from './frog.png'

const Test = () => {
  return (
    <main>
      <LoadingFrog url={frog.src} />
    </main>
  )
}

export default Test 
