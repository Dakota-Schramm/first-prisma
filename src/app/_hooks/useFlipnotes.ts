'use client'

import { useState, useEffect } from 'react'
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

  async function handleGetNextFlipnotes() {
    log.info('batchHandle');
    const flipnoteResponses = users.map(async (user) => {
      const response = await fetch(BATCH_FLIPNOTE_URL(user.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursor: flipnoteCursors[user.id] }),
      });

      if (!response.ok) throw new Error('Could not fetch flipnotes');
      const data = await response.json();

      const { flipnotes: flipnotesToAdd, cursor } = data;

      handleUpdateCursor({ [user.id]: cursor });
      return flipnotesToAdd;
    });

    const flipnotes = await Promise.all(flipnoteResponses);

    setFlipnotes((prevFlipnotes) => [...prevFlipnotes, ...flipnotes.flat()]);
  }

  return {
    flipnotes,
    handleGetNextFlipnotes,
    handleEmptyFlipnotes: () => setFlipnotes([])
  }
}

