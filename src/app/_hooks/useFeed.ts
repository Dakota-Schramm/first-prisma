'use client';

import { useState, useEffect } from 'react';

import { User } from '@prisma/client';
import { deserializeFavorites } from '@/app/_lib/deserializeLocalStorage';

type FeedDataProps = {
  type: 'all' | 'favorites' | 'random';
  users: User[];
  isLoaded: boolean;
};

// TODO: Fix hook so that feedType is checked on more than just initial render
export function useFeed() {
  const [feedData, setFeedData] = useState<FeedDataProps>({
    type: 'all',
    users: [],
    isLoaded: false,
  });

  useEffect(() => {
    let users: User[] | undefined;
    async function fetchUsers() {
      const favorites = deserializeFavorites();

      switch (feedData.type) {
        case 'all': {
          const defaultUsers = await fetchDefaultFeed();
          setFeedData((f) => ({ ...f, users: defaultUsers }));
          return;
        }
        case 'favorites': {
          const res = await fetch('/api/users/favorites', {
            method: 'POST',
            body: JSON.stringify({ data: favorites }),
          });
          const data = await res.json();
          const selectedUsers = data.users;
          setFeedData((f) => ({ ...f, users: selectedUsers }));
          return;
        }
        case 'random':
        default:
          throw new Error(`Invalid feed type: ${feedData.type}`);
      }
    }
    fetchUsers();
  }, [feedData.type]);

  useEffect(() => {
    if (feedData.users && 0 < feedData.users?.length) {
      setFeedData((f) => ({ ...f, isLoaded: true }));
    }
  }, [feedData.users]);

  return [feedData, setFeedData];
}

async function fetchDefaultFeed() {
  const res = await fetch('/api/users');
  const data = await res.json();

  return data.users;
}

export default useFeed;
