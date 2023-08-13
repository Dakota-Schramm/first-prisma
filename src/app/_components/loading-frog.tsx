'use client'

import React, { useEffect, useRef } from 'react'

const LoadingFrog = ({ url }: { url: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasElem = canvasRef.current
    const context = canvasElem?.getContext('2d')

    const image = new Image()
    image.onload = () => {
      console.log('loaded', this)
      context?.drawImage(image, 0, 0)
    }
    image.src = url;
  }, [])

  return (
    <>
      <canvas className='border border-white border-solid'
        ref={canvasRef} width={200} height={200} 
      />
      <img src={url} width={200} height={200} />
    </>
  )
}

export default LoadingFrog