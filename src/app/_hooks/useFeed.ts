'use client';

import { useState, useEffect } from 'react';
import { User } from '@prisma/client';

import { deserializeFavorites } from '@/app/_lib/deserializeLocalStorage';
import { useFlipnotes } from '@/hooks/useFlipnotes';

export type FeedDataProps = {
  type: 'hatena' | 'favorites' | 'random';
  users: User[];
  userCount: number;
  favoriteCount: number;
  isLoaded: boolean;
};

// TODO: Fix hook so that feedType is checked on more than just initial render
export function useFeed() {
  const [feedData, setFeedData] = useState<FeedDataProps>({
    type: 'hatena',
    users: [],
    userCount: 0,
    favoriteCount: 0,
    isLoaded: false,
  });
  const { users, type } = feedData;

  const { flipnotes, handleGetNextFlipnotes, handleEmptyFlipnotes } =
    useFlipnotes(users);

  useEffect(() => {
    console.log({ type });

    let users: User[] | undefined;
    async function fetchUsers() {
      const favoriteUsers = await fetchFavorites();
      const allUsers = await fetchDefaultFeed();

      switch (type) {
        case 'favorites': {
          setFeedData((f) => ({
            ...f,
            users: favoriteUsers,
            userCount: allUsers.length,
            favoriteCount: favoriteUsers.length,
          }));
          return;
        }
        case 'hatena': {
          const res = await fetch('/api/users/hatena');
          const data = await res.json();
          const selectedUsers = data.users;
          setFeedData((f) => ({
            ...f,
            users: selectedUsers,
            userCount: allUsers.length,
            favoriteCount: favoriteUsers.length,
          }));
          return;
        }
        case 'random': {
          setFeedData((f) => ({
            ...f,
            users: allUsers,
            userCount: allUsers.length,
            favoriteCount: favoriteUsers.length,
          }));
          return;
        }
        default:
          throw new Error(`Invalid feed type: ${type}`);
      }
    }
    fetchUsers();
  }, [type]);

  useEffect(() => {
    if (feedData.users && 0 < feedData.users?.length) {
      setFeedData((f) => ({ ...f, isLoaded: true }));
    }
  }, [users]);

  useEffect(() => {
    console.log({ users });
    if (users.length === 0) return;
    console.log('hit');
    handleEmptyFlipnotes();
    handleGetNextFlipnotes();
  }, [users]);

  return {
    flipnotes,
    feedData,
    handleGetNextFlipnotes,
    handleFeedTypeChange: (type: FeedDataProps['type']) => {
      setFeedData((prev) => ({ ...prev, type }));
    },
  };
}

async function fetchDefaultFeed() {
  const res = await fetch('/api/users');
  const data = await res.json();

  return data.users;
}

async function fetchFavorites() {
  const res = await fetch('/api/users/favorites', {
    method: 'POST',
    body: JSON.stringify({ data: deserializeFavorites() }),
  });
  const data = await res.json();

  return data.users;
}

export default useFeed;
