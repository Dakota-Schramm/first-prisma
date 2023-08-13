'use client'

import React, { useEffect, useRef } from 'react'

type Picture = {
  width: number
  height: number
}
const source: Picture = {
  width: 28,
  height: 29
}

const frameWidth = 6;
const frameHeight = 4

const scale = 2;
const scaledImage: Picture = {
  width: source.width * scale,
  height: source.height * scale
}


const ANIMATION_FRAMES = 8;

type LoadingFrogProps = {
  image: any // Nextjs imported image
}

const LoadingFrog = ({ image }: LoadingFrogProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d')

    const spriteSheet = new Image()
    spriteSheet.onload = () => {
      window.requestAnimationFrame(
        () => frameStep(
          { currentLoop: 0, frame: 0 },
          context,
          spriteSheet,
          image
        )
      )
    }
    spriteSheet.src = image.src;
  }, [])

  return (
    <canvas className='bg-gray-200 border border-white border-solid'
      ref={canvasRef}
      width={scaledImage.width}
      height={scaledImage.height}
    />
  )
}

type Point = {
  x: number
  y: number
}

function drawFrame(
  ctx: CanvasRenderingContext2D | null,
  image: any,
  transformation: { source: Point, canvas: Point },
) {
  if (ctx === null) return

  const {
    source: {
      x: frameX,
      y: frameY
    },
    canvas: {
      x: canvasX,
      y: canvasY
    }
  } = transformation

  ctx.drawImage(image,
                frameX, frameY,
                source.width, source.height, 
                canvasX, canvasY,
                scaledImage.width, scaledImage.height);
}

function frameStep(
  timing: {
    currentLoop: number,
    frame: number,
  },
  ctx: CanvasRenderingContext2D | null,
  canvasImage: HTMLImageElement,
  image: any
) {
  if (ctx === null) return  

  const { currentLoop, frame } = timing

  if (frame < 8) {
    window.requestAnimationFrame(
      () => frameStep(
        { currentLoop: currentLoop, frame: frame + 1 },
        ctx,
        canvasImage,
        image
      )
    )
    return;
  }

  ctx.clearRect(0, 0, scaledImage.width, scaledImage.height);
  drawFrame(ctx, canvasImage,
    {
      source: {
        x: (source.width) * currentLoop + (frameWidth * (currentLoop + 1)),
        y: (image.height - frameHeight) - source.height
      },
      canvas: {
        x: 0,
        y: 0
      }
    }
  )

  let nextLoopIndex = currentLoop === ANIMATION_FRAMES - 1
    ? 0
    : currentLoop + 1;

  window.requestAnimationFrame(
    () => frameStep(
      { currentLoop: nextLoopIndex, frame: 0 },
      ctx,
      canvasImage,
      image
    )
  );
}

export default LoadingFrog
