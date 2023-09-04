'use client';

import { storageAvailable } from '../_lib/storageAvailable';
import log from '../_utils/log';

// TODO: Move to useFavorites hook
export function deserializeFavorites() {
  if (!storageAvailable('localStorage')) {
    // handle gracefully
    log.error('Local storage not available');
    return [];
  }

  const favoritesJsonString = localStorage.getItem('favorites');
  if (!favoritesJsonString) return [];

  const res = JSON.parse(favoritesJsonString);
  const data = res.data;

  return data;
}
