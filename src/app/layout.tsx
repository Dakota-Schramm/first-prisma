'use client';

import './globals.css';
import React, { useState, useRef, RefObject, useEffect } from 'react';
import Image from 'next/image';

import Header from '@/app/_components/header';
import plus from '@/assets/images/plus.svg';
import AddUser from '@/components/dialogs/addUser';
import log from './_utils/log';
import AnalyticsProvider from './_contexts/analytics';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [analytics, setAnalytics] = useState({});
  const addUser = useRef<HTMLDialogElement>(null);

  return (
    <html lang='en'>
      <body className='bg-main-online'>
        <Header>
          <button onClick={() => handleOpen(addUser)}>
            <Image src={plus} alt='Plus' />
          </button>
        </Header>
        <AnalyticsProvider value={{ analytics, setAnalytics }}>
          {children}
        </AnalyticsProvider>
        <AddUser ref={addUser} handleClose={() => handleClose(addUser)} />
      </body>
    </html>
  );
}

function handleOpen(ref: RefObject<HTMLDialogElement>) {
  const node = ref.current!;
  if (node) {
    node.showModal();
    log('Open: ', node.open);
  }
}

function handleClose(ref: RefObject<HTMLDialogElement>) {
  const node = ref.current!;
  log('closing');
  if (node) node.close();
}
