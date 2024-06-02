'use client'

import React from 'react';
import Link from 'next/link';
import BrandLink from '../navigation/BrandLink';
import { useRouter, usePathname } from 'next/navigation';
import Accordion from '../elements/Accordion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleHomeClick = () => {
    router.push('/');
  };

  const linkClasses = (path: string) =>
    pathname === path
      ? 'flex text-white bg-tertiary border border-transparent rounded-lg py-2 px-3'
      : 'flex text-white border border-transparent hover:border-tertiary rounded-lg py-2 px-3';

  return (
    <div className="flex min-h-screen max-w-[80rem] mx-auto relative">
      <nav className="w-[20rem] border-x border-tertiary text-white p-4 fixed top-0 h-screen overflow-y-auto">
        <div onClick={handleHomeClick}>
          <BrandLink />
        </div>
        <ul className="text-md mt-8">
          <li>
            <Link href="/colors" className={linkClasses('/colors')}>
              Colors
            </Link>
          </li>
          <li>
            <Accordion title="UI Libary" href="/ui-library">
              <Link href="/ui-library/elements" className={linkClasses('/ui-library/elements')}>
                Elements
              </Link>
              <Link href="/ui-library/web-blocks" className={linkClasses('/ui-library/web-blocks')}>
                Web Blocks
              </Link>
              {/* You can add more content or links within the accordion */}
            </Accordion>
          </li>
          <li>
            <Link href="/about" className={linkClasses('/about')}>
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className={linkClasses('/contact')}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex flex-col w-full min-h-screen p-24 ml-[20rem]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
