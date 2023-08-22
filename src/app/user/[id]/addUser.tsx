'use client';

import React from 'react';

import { storageAvailable } from '@/app/_lib/storageAvailable';
import { deserializeFavorites } from '@/app/_lib/deserializeLocalStorage';

type AddUserButtonProps = {
  id: string;
};

const AddUserButton = ({ id }: AddUserButtonProps) => {
  const favorited = getFavoriteStatus(id);
  return (
    <button onClick={() => addUserToFavorites(id)}>
      {favorited ? 'Favorited <3' : 'Favorite User'}
    </button>
  );
};

function addUserToFavorites(id: string) {
  if (!storageAvailable('localStorage')) return;

  const favoritesJsonString = localStorage.getItem('favorites');

  let favorites: string[] = [];
  if (favoritesJsonString !== null) {
    const res = JSON.parse(favoritesJsonString);
    const data = res.data;
    favorites = data;
  }
  favorites.push(id);

  console.log('favorites: ', favorites);
  localStorage.setItem('favorites', JSON.stringify({ data: favorites }));
}

function getFavoriteStatus(id: string): boolean {
  const favorites = deserializeFavorites();
  return favorites?.includes(id) ?? false;
}


export default AddUserButton;
