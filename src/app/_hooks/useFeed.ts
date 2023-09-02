'use client';

import { useState, useEffect } from 'react';
import { User } from '@prisma/client';

import { useFlipnotes } from '@/hooks/useFlipnotes';
import log from '../_utils/log';
import useFavorites from './useFavorites';

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
  const [ favorites, handleFavoritesChange ] = useFavorites()

  const { flipnotes, handleGetNextFlipnotes, handleEmptyFlipnotes } =
    useFlipnotes(users);

  useEffect(() => {
    log.debug({ type });
    async function fetchUsers() {
      switch (type) {
        case 'favorites': {
          let favoriteUsers: User[] = []
          if (favorites && 0 < favorites.length) {
            favoriteUsers = await fetchFavorites(favorites);
          }
          setFeedData((f) => ({
            ...f,
            users: favoriteUsers,
            isLoaded: true
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
            isLoaded: true
          }));
          return;
        }
        case 'random': {
          const allUsers = await fetchDefaultFeed();
          setFeedData((f) => ({
            ...f,
            users: allUsers,
            isLoaded: true
          }));
          return;
        }
        default: throw new Error(`Invalid feed type: ${type}`);
      }
    }
    fetchUsers();
  }, [type]);

  useEffect(() => {
    if (favorites.length === 0) return
    setFeedData((f) => ({ ...f, favoriteCount: favorites.length, }));
  }, [favorites]);

  useEffect(() => {
    log.debug({ users });
    if (users.length === 0) return;
    log.debug('hit');
    handleEmptyFlipnotes();
    handleGetNextFlipnotes();
  }, [users]);

  return {
    flipnotes,
    feedData,
    handleGetNextFlipnotes,
    handleFeedTypeChange: (type: FeedDataProps['type']) => {
      setFeedData((prev) => ({ ...prev, type }))
    },
  };
}

async function fetchDefaultFeed() {
  const res = await fetch('/api/users');
  const data = await res.json();

  return data.users;
}

async function fetchFavorites(favorites: Pick<User, "id">[]) {
  const res = await fetch('/api/users/favorites', {
    method: 'POST',
    body: JSON.stringify({ data: favorites }),
  });
  const data = await res.json();

  return data.users;
}

export default useFeed;
