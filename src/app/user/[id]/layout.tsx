import Link from 'next/link';

import Header from '@/app/_components/header';

// TODO: Add framer for animations
const Layout = (
  { children }: { children: React.ReactNode }
) => {
  return (
    <>
      <Header
        links={
          <nav>
            <Link href="/">Home</Link>
            <Link href="/feed">Feed</Link>
          </nav>
        }>
          <button>
            Favorite User
          </button>
      </Header>
      {children}
    </>
  );
}

export default Layout
