//Use this page to edit the navbar display

'use client';

import React from 'react';
import BrandLink from '../navigation/BrandLink';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleHomeClick = () => {
    router.push('/');
  };

  const linkClasses = (path: string) =>
    pathname === path
      ? 'flex text-white bg-secondary border border-transparent rounded-lg py-2 px-3'
      : 'flex text-white border border-transparent hover:border-secondary rounded-lg py-2 px-3';

  return (
    <div className="flex flex-row max-w-[80rem] mx-auto">
      <nav className="w-[18rem] border-x border-secondary text-white p-4 h-screen relative">
        <div className="flex flex-col justify-between sticky h-full top-4">
          <div>
            <div className="flex flex-col" onClick={handleHomeClick}>
              <BrandLink />
            </div>
            <ul className="text-sm">
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
                <Link href="/components/tablist" className={linkClasses('/components/tablist')}>
                  Tablist
                </Link>
              </li>
              <li>
                <Link href="/components/toggle" className={linkClasses('/components/toggle')}>
                  Toggle
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
              <li>
                <Link href="#">
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-row gap-4 p-3">
            <Link
              href="https://www.linkedin.com/company/brew-la/"
              target="_blank"
              className="opacity-50 hover:opacity-100 transition-all ease-out duration-200"
            >
              <Image
                src="/images/linkedin.svg"
                width={18}
                height={18}
                alt="linkedin"
              />
            </Link>
            <Link
              href="https://github.com/brewla"
              target="_blank"
              className="opacity-50 hover:opacity-100 transition-all ease-out duration-200"
            >
              <Image
                src="/images/github-mark-white.svg"
                width={18}
                height={18}
                alt="weblink"
              />
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex flex-col w-full max-h-screen p-24 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
