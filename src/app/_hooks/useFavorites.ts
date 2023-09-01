'use client'

import { useEffect, useState } from 'react'

import { deserializeFavorites } from '@/app/_lib/deserializeLocalStorage';
import { storageAvailable } from '@/app/_lib/storageAvailable';
import { User } from '@prisma/client';
import log from '../_utils/log';

type FavoriteId = User['id']

function useFavorites(): [FavoriteId[], (id: FavoriteId) => void] {
  const [favorites, setFavorites] = useState([])
  const [isClient, setIsClient] = useState(false)

  function handleFavoritesChange(id: FavoriteId) {
    if (!storageAvailable('localStorage')) {
      if (isClient !== true) return
      else throw new Error('Local storage not available')
    }

    const favoritesJsonString = localStorage.getItem('favorites');

    let favorites: string[] = [];
    if (favoritesJsonString !== null) {
      const res = JSON.parse(favoritesJsonString);
      const data = res.data;
      favorites = data;
    }

    if (favorites.includes(id)) {
      favorites = favorites.filter((favId) => favId !== id);
    } else favorites.push(id);

    log.debug('favorites: ', favorites);
    localStorage.setItem('favorites', JSON.stringify({ data: favorites }));
    setFavorites(favorites)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!storageAvailable('localStorage')) {
      if (isClient !== true) return
      else throw new Error('Local storage not available')
    }
    const storageFavorites = deserializeFavorites();
    log.debug({ storageFavorites })
    setFavorites(storageFavorites)
  }, [isClient])

  // useEffect(() => {
  //   console.log({ favorites })
  // }, [favorites])
  

  return [favorites, handleFavoritesChange]
}

export default useFavorites
