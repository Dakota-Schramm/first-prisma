'use client'

import { useEffect, useState } from 'react'

import Flipnote from '@/app/_components/flipnote'
import { useFlipnotes } from '../_hooks/useFlipnotes';
import { User } from '@prisma/client';

export const BulletinBoard = ({ users }: { users: User[] }) => {
  const [ page, setPage ] = useState(0)
  const data = useFlipnotes(users)
  const { flipnotes, handleGetNextFlipnotes } = data;

  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId)
    if (user === undefined) throw new Error('User not found')

    return user.name
  }

  useEffect(() => {
    handleGetNextFlipnotes()
  }, [page])


  return (
    <section className="flex flex-col items-center justify-between min-h-screen p-24">
      {
        flipnotes.map(({id, userId}) => (
          <Flipnote key={id} id={id} userName={getUserName(userId)} />
        ))
      }
    </section>
  )
}
