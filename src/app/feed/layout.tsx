'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image';

import Header from '@/app/_components/header';
import plus from '@/assets/images/plus.svg'
import AddUser from '@/components/dialogs/addUser';
import log from '../_utils/log';

// TODO: Add framer for animations
const Layout = (
  { children }: { children: React.ReactNode }
) => {
  const addUser = useRef<HTMLDialogElement>(null)

  function handleOpen() {
    const node = addUser.current!
    if (node) {
      node.showModal()
      log("Open: ", node.open)
    }
  }

  function handleClose() {
    const node = addUser.current!
    log('closing')
    if (node) node.close()
  }

  return (
    <>
      <Header>
        <button onClick={handleOpen}>
          <Image src={plus} alt='Plus' />
        </button>
      </Header>
      {children}
      <AddUser ref={addUser} {...{ handleClose }} />
    </>
  );
}

export default Layout
