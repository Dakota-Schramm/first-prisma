'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, Flipnote } from '@prisma/client'
import log from '../_utils/log';

const BATCH_FLIPNOTE_URL = (id: string) => `/api/users/${id}/flipnotes`;
async function handleGetNextFlipnotes (flipnoteCursors) {
  if (!flipnoteCursors || Object.keys(flipnoteCursors).length === 0) return 
  log.info('batchHandle');
  const flipnoteResponses = Object.keys(flipnoteCursors).map(async (userId) => {
    const response = await fetch(BATCH_FLIPNOTE_URL(userId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cursor: flipnoteCursors[userId] }),
    });

    if (!response.ok) throw new Error('Could not fetch flipnotes');
    const data = await response.json();

    return data.flipnotes;
  });

  const flipnotes = await Promise.all(flipnoteResponses);
  return flipnotes
}

type FlipnoteCursors = {
  [key: Flipnote['userId']]: Flipnote['id'] | undefined
}

// TODO: Create function that allows user to switch to different feed
// and completely clear out current flipnotes
export const useFlipnotes = (
  users: User[] = [],
): {
  flipnotes: Flipnote[],
  flipnoteCursors: FlipnoteCursors,
  setFlipnotes: React.Dispatch<React.SetStateAction<Flipnote[]>>,
  handleGetNextFlipnotes: (flipnoteCursors: FlipnoteCursors) => Promise<Flipnote[][]>,
} => {
  // TODO: Change this to use DB
  // For function, will use getFlipnoteIdsForUser if 
  // user has not been populated into DB yet
  const [ flipnotes, setFlipnotes ] = useState([])

  const [flipnoteCursors, setFlipnoteCursors] = useState(
    Object.fromEntries(users.map((user) => [user.id, undefined]))
  );
  if (0 < flipnotes?.length) {
    const newCursors = users.map(
      (user) => flipnotes.findLast((flipnote) => flipnote.userId === user.id)
    )
    setFlipnoteCursors(newCursors)
  }

  useEffect(() => { 
    setFlipnotes([])
  }, [users])

  useEffect(() => {
    async function updateFlipnotes() {
      const newFlipnotes = await handleGetNextFlipnotes(flipnoteCursors)
      if (!newFlipnotes) return
      setFlipnotes((prevFlipnotes) => [...prevFlipnotes, ...newFlipnotes.flat()]);
    }
    updateFlipnotes()
  }, [flipnoteCursors])

  return {
    flipnotes,
    flipnoteCursors,
    setFlipnotes,
    handleGetNextFlipnotes,
  }
}
