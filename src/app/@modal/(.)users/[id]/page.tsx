'use client'

import { DialogContext } from '@/app/_contexts/dialog';
import { UserHeader, fetchProfile } from '@/app/users/[id]/page';
import { Dialog } from '@headlessui/react';
import React, { useContext, useState } from 'react'

const UserModalPage = () => {
  const { dialogProps, setDialogProps } = useContext(DialogContext)

  if (dialogProps === null) return null

  return (
    <Dialog isOpen={dialogProps !== null} onClose={() => setDialogProps(null)}>
      <Dialog.Panel>
        <UserHeader {...dialogProps} />
      </Dialog.Panel>
    </Dialog>
  )
}

export default UserModalPage
