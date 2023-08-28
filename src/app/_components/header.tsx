import React, { ReactNode } from 'react'
import Link from 'next/link';

const Header = (
  { links, children }: { links?: ReactNode, children: ReactNode }
) => {
  return (
    <header className='fixed top-0 z-10 flex items-center justify-between w-full h-20 px-4 text-black bg-white'>
      <div className='flex items-center justify-end space-x-2'>
        <h1 className='text-xl font-bold font-pop text-main-offline'>
          <Link href="/">Flipnote -- Legacy Viewer</Link>
        </h1>
        {links}
      </div>
      {children}
    </header>
  );
}

export default Header