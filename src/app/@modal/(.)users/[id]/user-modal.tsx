'use client'

import { UserHeader, fetchProfile } from '@/app/users/[id]/page';
import { Dialog } from '@headlessui/react';
import { User } from '@prisma/client';
import React, { useState } from 'react'


type UserModalProps = {
  id: User['id'];
  flipnoteCount: number;
  userName: User['name'];
};

const UserModal = ({ id, flipnoteCount, userName }: UserModalProps) => {
  const [ isOpen, setIsOpen ] = useState(false)
  return (
    <Dialog onClose={() => setIsOpen(o => !o)} {...{isOpen}}>
      <UserHeader {...{ id, flipnoteCount, userName }} />
    </Dialog>

  )
}

export default UserModal
