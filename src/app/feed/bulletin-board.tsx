'use client'

import { useEffect } from 'react'
import { User } from '@prisma/client';

import { Flipnote } from '@/app/_components/flipnote'
import { useFlipnotes } from '@/hooks/useFlipnotes';

export const BulletinBoard = ({ users }: { users: User[] }) => {
  const { flipnotes, handleGetNextFlipnotes } = useFlipnotes(users);

  useEffect(() => {
    handleGetNextFlipnotes();
  }, []);

  return (
    <section className='flex flex-col items-center justify-between min-h-screen p-24'>
      {flipnotes.map(({ id, userId }, idx) => {
        const userName = getUserName(users, userId);

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
}

function getUserName(users: User[], userId: string) {
  const user = users.find(user => user.id === userId);
  if (user === undefined) throw new Error('User not found');

  return user.name;
}
