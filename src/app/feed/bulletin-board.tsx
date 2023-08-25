'use client'

import { useState, useEffect } from 'react';
import { User } from '@prisma/client';

import { Flipnote } from '@/app/_components/flipnote';
import { useFlipnotes } from '@/hooks/useFlipnotes';
import { deserializeFavorites } from '@/app/_lib/deserializeLocalStorage';

export const BulletinBoard = () => {
  const [feed, setFeed] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { flipnotes, handleGetNextFlipnotes } = useFlipnotes(feed);

  useEffect(() => {
    let users: User[] | undefined;
    async function fetchUsers() {
      const favorites = deserializeFavorites();

      if (!favorites.length) {
        const defaultUsers = await fetchDefaultFeed();
        setFeed(defaultUsers);
      } else {
        const res = await fetch('/api/users', {
          method: 'POST',
          body: JSON.stringify({ data: favorites }),
        });
        const data = await res.json();
        const selectedUsers = data.users;
        setFeed(selectedUsers);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (feed && 0 < feed?.length) setIsLoaded(true);
  }, [feed]);

  useEffect(() => {
    handleGetNextFlipnotes();
  }, [isLoaded]);

  return (
    <section className='flex flex-col items-center justify-between min-h-screen p-24'>
      {flipnotes.map(({ id, userId }, idx) => {
        const userName = getUserName(feed, userId);

        return (
          <Flipnote
            key={id}
            isLast={idx === flipnotes.length - 1}
            {...{ id, userId, userName, handleGetNextFlipnotes }}
          />
        );
      })}
    </section>
  );
};

function getUserName(users: User[], userId: string) {
  const user = users.find((user) => user.id === userId);
  if (user === undefined) throw new Error('User not found');

  return user.name;
}

async function fetchDefaultFeed() {
  const res = await fetch('/api/users/all');
  const data = await res.json();

  return data.users;
}
