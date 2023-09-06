'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, Flipnote } from '@prisma/client'
import log from '../_utils/log';

const BATCH_FLIPNOTE_URL = (id: string) => `/api/users/${id}/flipnotes`;

async function fetchNextFlipnotes(flipnoteCursors: any) {
  if (!Object.keys(flipnoteCursors).length) {
    log.error('No flipnote cursors provided')
    return []
  }
  log.info('batchHandle', flipnoteCursors);
  const flipnoteRequests = Object.keys(flipnoteCursors).map(async (userId) => {
    const response = await fetch(BATCH_FLIPNOTE_URL(userId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cursor: flipnoteCursors[userId] }),
    });

    if (!response.ok) throw new Error('Could not fetch flipnotes');
    return await response.json();
  });

  const flipnoteResponses = await Promise.all(flipnoteRequests);
  log.debug({ flipnoteResponses })
  return flipnoteResponses.map(r => ({
    flipnotes: r.flipnotes,
  }))
}

export const useFlipnotes = (
  users: User[] = [],
) => {
  // TODO: Change this to use DB
  // For function, will use getFlipnoteIdsForUser if 
  // user has not been populated into DB yet
  const [ flipnotes, setFlipnotes ] = useState<Flipnote[]>([])
  const INITIAL_CURSORS = Object.fromEntries(users.map((user) => [user.id, undefined]))
  const [ flipnoteCursors, setFlipnoteCursors ] = useState<any>(INITIAL_CURSORS)

  useEffect(() => {
    log.debug('Running flipnote fetch...', flipnoteCursors); 
  }, [flipnoteCursors])

  const handleGetNextFlipnotes = useCallback(async () => {
    const flipnoteResponses = await fetchNextFlipnotes(flipnoteCursors)
    log.debug({ flipnoteResponses })
    const newFlipnotes = flipnoteResponses.map(({ flipnotes }) => flipnotes.flat());
    setFlipnotes((prevFlipnotes) => [...prevFlipnotes, ...newFlipnotes]);
    setFlipnoteCursors({ ...calculateFlipnoteCursors(newFlipnotes) })
  }, [flipnoteCursors])

  const handleEmptyFlipnotes = useCallback(() => {
    setFlipnotes([])
    setFlipnoteCursors(INITIAL_CURSORS)
  }, [INITIAL_CURSORS])

  return {
    flipnotes,
    handleGetNextFlipnotes,
    handleEmptyFlipnotes
  }
}

function calculateFlipnoteCursors(flipnotes) {
  const flipnoteCursors = {};

  flipnotes.forEach(f => {
    const lastFlipnoteForUser = f.at(-1)
    const { id, userId } = lastFlipnoteForUser
    log.info()
    flipnoteCursors[userId] = id
  })

  log.info('Generated flipnote cursors: ', flipnoteCursors)
  return flipnoteCursors
}

