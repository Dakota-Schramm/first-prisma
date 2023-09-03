'use client'

import React, { useContext } from 'react'
import Link from 'next/link'
import { User } from '@prisma/client';
import { DialogContext } from '../_contexts/dialog';

const UserTitle = ({ id, name }: User) => {
  const { dialogProps, setDialogProps } = useContext(DialogContext)

  return (
    <>
      <Link
        href={`/users/${id}`}
        className='underline hover:text-main-offline'
        onMouseOver={() => {
          setDialogProps({
            id,
            userName: name,
            flipnoteCount: 0,
          })
        }}
        onMouseOut={() => {
          setDialogProps(null)
        }}
      >
        {name}
      </Link>
    </>
  )
}

export default UserTitle