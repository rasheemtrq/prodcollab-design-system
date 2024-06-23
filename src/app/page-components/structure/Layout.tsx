//Use this page to edit the navbar display

'use client';

import React from 'react';
import Link from 'next/link';
import BrandLink from '@/components/navigation/BrandLink';
import { useRouter, usePathname } from 'next/navigation';

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
    <div className="flex max-w-[80rem] mx-auto">
      <nav className="w-[18rem] border-x border-tertiary text-white p-4 relative">
        <div className="sticky top-4">
          <div onClick={handleHomeClick}>
            <BrandLink />
          </div>
          <ul className="text-sm mt-8">
            <li>
              <h2 className="text-secondary px-3 py-2 mt-6">Components</h2>
            </li>
            <li>
              <Link href="/components/accordion" className={linkClasses('/components/accordion')}>
                Accordion
              </Link>
            </li>
            <li>
              <Link href="/components/alert" className={linkClasses('/components/alert')}>
                Alert
              </Link>
            </li>
            <li>
              <Link href="/components/avatar" className={linkClasses('/components/avatar')}>
                Avatar
              </Link>
            </li>
            <li>
              <Link href="/components/button" className={linkClasses('/components/button')}>
                Button
              </Link>
            </li>
            <li>
              <Link href="/components/card" className={linkClasses('/components/card')}>
                Card
              </Link>
            </li>
            <li>
              <Link href="/components/chip" className={linkClasses('/components/chip')}>
                Chip
              </Link>
            </li>
            <li>
              <Link href="/components/input-field" className={linkClasses('/components/input-field')}>
                Input Field
              </Link>
            </li>
            <li>
              <Link href="/components/skeleton" className={linkClasses('/components/skeleton')}>
                Skeleton
              </Link>
            </li>
            <li>
              <Link href="/components/tooltip" className={linkClasses('/components/tooltip')}>
                Tooltip
              </Link>
            </li>
            <li>
              <h2 className="text-secondary px-3 py-2 mt-6">Styles</h2>
            </li>
            <li>
              <Link href="/colors" className={linkClasses('/colors')}>
                Colors
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="flex flex-col w-full min-h-screen p-24">
        {children}
      </main>
    </div>
  );
};

export default Layout;
