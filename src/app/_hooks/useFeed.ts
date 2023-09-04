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
    userCount: 0, // Total loaded users
    favoriteCount: 0, // # of ids in favorites
    isLoaded: false,
  });
  const { users, type } = feedData;
  const [ favorites, ] = useFavorites()
  const { flipnotes, handleGetNextFlipnotes } = useFlipnotes(users);

  useEffect(() => {
    async function getLoadedUserCount() {
      const allUsers = await fetchDefaultFeed();
      setFeedData((f) => ({ ...f, userCount: allUsers.length }));
    } 
    getLoadedUserCount()
  }, []);

  useEffect(() => {
    log.debug({ type });
    async function fetchUsers() {
      let newUsers = [];
      if (type === 'favorites') {
        if (!favorites || favorites.length === 0) return
        newUsers = await fetchFavorites(favorites);
      } else if (type === 'hatena') {
        const res = await fetch('/api/users/hatena');
        const data = await res.json();
        newUsers = data.users;
      } else if (type === 'random') newUsers = await fetchDefaultFeed();
      else throw new Error(`Invalid feed type: ${type}`);

      setFeedData((f) => ({
        ...f,
        users: newUsers,
        isLoaded: true
      }));
    }
    fetchUsers();
  }, [type, favorites]);

  useEffect(() => {
    setFeedData((f) => ({ ...f, favoriteCount: favorites.length, }));
  }, [favorites]);

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

async function fetchFavorites(favorites: User["id"][]) {
  const res = await fetch('/api/users/favorites', {
    method: 'POST',
    body: JSON.stringify({ data: favorites }),
  });
  const data = await res.json();

  return data.users;
}

export default useFeed;
