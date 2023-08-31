'use client';

import React, { useEffect, useState } from 'react';
import { User } from '@prisma/client';

import { storageAvailable } from '@/app/_lib/storageAvailable';
import useFavorites from '@/app/_hooks/useFavorites';

type AddUserButtonProps = {
  id: string;
};

const AddUserButton = ({ id }: AddUserButtonProps) => {
  const [favorites, handleFavoritesChange] = useFavorites()
  const favorited = favorites?.includes(id) ?? false

  return (
    <button
      onClick={() => handleFavoritesChange(id)}
    >
      {favorited ? 'Favorited <3' : 'Favorite User'}
    </button>
  );
};

export default AddUserButton;
