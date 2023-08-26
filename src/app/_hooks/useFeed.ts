'use client';

import { useState, useEffect } from 'react';

import { User } from '@prisma/client';
import { deserializeFavorites } from '@/app/_lib/deserializeLocalStorage';

export function useFeed() {
  const [feed, setFeed] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // TODO: Make hook for this
  useEffect(() => {
    let users: User[] | undefined;
    async function fetchUsers() {
      const favorites = deserializeFavorites();

      if (!favorites.length) {
        const defaultUsers = await fetchDefaultFeed();
        setFeed(defaultUsers);
      } else {
        const res = await fetch('/api/users/favorites', {
          method: 'POST',
          body: JSON.stringify({ data: favorites }),
        });
        const data = await res.json();
        const selectedUsers = data.users;
        setFeed(selectedUsers);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (feed && 0 < feed?.length) setIsLoaded(true);
  }, [feed]);

  return [feed, isLoaded];
}

async function fetchDefaultFeed() {
  const res = await fetch('/api/users');
  const data = await res.json();

  return data.users;
}

export default useFeed;
