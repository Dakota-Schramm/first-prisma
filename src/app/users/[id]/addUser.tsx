'use client';

import React, { useEffect, useState } from 'react';

import { storageAvailable } from '@/app/_lib/storageAvailable';
import { deserializeFavorites } from '@/app/_lib/deserializeLocalStorage';
import log from '@/app/_utils/log';

type AddUserButtonProps = {
  id: string;
};

const AddUserButton = ({ id }: AddUserButtonProps) => {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(getFavoriteStatus(id));
  }, []);

  return (
    <button
      onClick={() => {
        toggleUserFavorite(id);
        setFavorited((f) => !f);
      }}
    >
      {favorited ? 'Favorited <3' : 'Favorite User'}
    </button>
  );
};

function toggleUserFavorite(id: string) {
  if (!storageAvailable('localStorage')) return;

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
}

function getFavoriteStatus(id: string): boolean {
  const favorites = deserializeFavorites();
  return favorites?.includes(id) ?? false;
}


export default AddUserButton;
