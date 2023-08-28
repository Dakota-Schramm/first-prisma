import Link from 'next/link';

import Header from '@/app/_components/header';
import AddUserButton from './addUser';

// TODO: Add framer for animations
const Layout = ({
  params,
  children,
}: {
  params: any;
  children: React.ReactNode;
}) => {
  const { id } = params;
  return (
    <>
      <Header
        links={
          <nav className='space-x-2'>
            <Link href='/'>Home</Link>
          </nav>
        }
      >
        <AddUserButton id={id} />
      </Header>
      {children}
    </>
  );
};

export default Layout
