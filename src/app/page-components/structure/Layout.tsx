//Use this page to edit the navbar display

'use client';

import React from 'react';
import BrandLink from '../navigation/BrandLink';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { docs, groups } from '@/app/registry';

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
      <nav className="w-[18rem] shrink-0 border-x border-secondary text-white p-4 h-screen relative">
        <div className="flex flex-col justify-between h-full">
          <div className="overflow-y-auto min-h-0 -mx-1 px-1">
            <div className="flex flex-col" onClick={handleHomeClick}>
              <BrandLink />
            </div>
            <ul className="text-sm">
              {groups.map((group) => (
                <React.Fragment key={group}>
                  <li>
                    <h2 className="text-secondary px-3 py-2 mt-6">{group}</h2>
                  </li>
                  {docs
                    .filter((d) => d.group === group)
                    .map((d) => (
                      <li key={d.href}>
                        <Link
                          href={d.href}
                          aria-current={pathname === d.href ? 'page' : undefined}
                          className={linkClasses(d.href)}
                        >
                          <span className="flex-1">{d.name}</span>
                          {d.isNew && (
                            <span className="text-[10px] uppercase tracking-wider text-accent self-center">New</span>
                          )}
                        </Link>
                      </li>
                    ))}
                </React.Fragment>
              ))}
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
      <main className="flex flex-col w-full min-w-0 max-h-screen p-24 overflow-y-auto">
        {children}
      </main>
      <ToastContainer position="top-center" autoClose={3000} theme="dark" newestOnTop closeOnClick pauseOnHover />
    </div>
  );
};

export default Layout;
