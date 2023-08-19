import React from 'react'

const Header = (
  { children }: { children: React.ReactNode }
) => {
  return (
    <header className='fixed top-0 flex items-center justify-end w-full h-20 px-4 text-black bg-white'>
      Flipnote -- Legacy Viewer
      { children }
    </header>
  )
}

export default Header