'use client'

import { useState, useEffect, useCallback } from 'react'
import { User } from '@prisma/client'
import log from '../_utils/log';

const BATCH_FLIPNOTE_URL = (id: string) => `/api/users/${id}/flipnotes`;

// TODO: Create function that allows user to switch to different feed
// and completely clear out current flipnotes
export const useFlipnotes = (
  users: User[] = [],
) => {
  // TODO: Change this to use DB
  // For function, will use getFlipnoteIdsForUser if 
  // user has not been populated into DB yet
  const [ flipnotes, setFlipnotes ] = useState([])
  const [flipnoteCursors, setFlipnoteCursors] = useState(
    Object.fromEntries(users.map((user) => [user.id, undefined]))
  );

  function handleUpdateCursor(cursor) {
    setFlipnoteCursors((prevCursors) => ({ ...prevCursors, ...cursor }));
  }

  const handleGetNextFlipnotes = useCallback(async () => {
    log.info('batchHandle');
    const flipnoteResponses = Object.keys(flipnoteCursors).map(async (userId) => {
      const response = await fetch(BATCH_FLIPNOTE_URL(userId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursor: flipnoteCursors[userId] }),
      });

      if (!response.ok) throw new Error('Could not fetch flipnotes');
      const data = await response.json();

      const { flipnotes: flipnotesToAdd, cursor } = data;

      handleUpdateCursor({ [userId]: cursor });
      return flipnotesToAdd;
    });

    const flipnotes = await Promise.all(flipnoteResponses);

    setFlipnotes((prevFlipnotes) => [...prevFlipnotes, ...flipnotes.flat()]);
  }, [flipnoteCursors])

  const handleInitializeFeed = useCallback(() => { 
    setFlipnotes([])
    setFlipnoteCursors(prevCursors => {
      const newCursors = {...prevCursors}
      const keys = Object.keys(prevCursors)
      keys.forEach(k => newCursors[k] = undefined)

      return newCursors
    })
    handleGetNextFlipnotes()
  }, [handleGetNextFlipnotes])

  return {
    flipnotes,
    handleGetNextFlipnotes,
    handleInitializeFeed
  }
}

