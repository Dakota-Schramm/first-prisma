'use client';

import React from 'react';

import { storageAvailable } from '@/app/_lib/storageAvailable';

const AddUserButton = ({ id }: { id: string }) => {
  return <button onClick={() => addUserToFavorites(id)}>Favorite User</button>;
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
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

export default AddUserButton;
