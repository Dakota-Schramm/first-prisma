'use client'

import { useState, useEffect } from 'react'
import { User } from '@prisma/client'

const BATCH_FLIPNOTE_URL = (id) => `/api/user/${id}/flipnoteBatch`

export const useFlipnotes = (
  users: User[] = [],
) => {
  // TODO: Change this to use DB
  // For function, will use getFlipnoteIdsForUser if 
  // user has not been populated into DB yet
  const [ flipnotes, setFlipnotes ] = useState([])
  const [ flipnoteCursors, setFlipnoteCursors ] = useState(
    Object.fromEntries(users.map(
      (user) => [user.id, undefined]
    ))
  )

  if (!users.length) throw new Error('No users provided')

  function handleUpdateCursor(cursor) {
    setFlipnoteCursors(
      (prevCursors) => ({ ...prevCursors, cursor })
    )
  }

  async function handleGetNextFlipnotes() {
    const flipnoteResponses = users.map(async (user) => {
      const URL = BATCH_FLIPNOTE_URL(user.id)
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cursor: flipnoteCursors[user.id] }),
      })

      if (!response.ok) throw new Error('Could not fetch flipnotes')
      const data = await response.json();

      console.log(data)
      const {
        flipnotes: flipnotesToAdd,
        cursor
      } = data

      handleUpdateCursor(cursor)
      return flipnotesToAdd;
    });

    const flipnotes = await Promise.all(flipnoteResponses)
    console.log(flipnotes)

    setFlipnotes(
      (prevFlipnotes) => [...prevFlipnotes, ...flipnotes.flat()]
    )
  }

  return { flipnotes, handleGetNextFlipnotes }
}

