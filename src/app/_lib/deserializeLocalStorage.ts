'use client';

import { storageAvailable } from '../_lib/storageAvailable';

// TODO: Move to useFavorites hook
export function deserializeFavorites() {
  if (!storageAvailable('localStorage'))
    throw new Error('Local storage not available');

  const favoritesJsonString = localStorage.getItem('favorites');
  if (!favoritesJsonString) return [];

  const res = JSON.parse(favoritesJsonString);
  const data = res.data;
  console.log(': ', localStorage, data);

  return data;
}
