//Use this page to edit the main page display

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { findDoc } from '@/app/registry';

const extraPages: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Welcome!',
    description:
      'Explore the ProdCollab component library: general UI components plus the knobs, faders, meters, clips and presence indicators the DAW is built from. Everything is TypeScript and Tailwind, and runs on shared design tokens.',
  },
  '/about': { title: 'About', description: 'The design system behind ProdCollab, an online DAW for producers to collaborate in real time.' },
};

const Header01: React.FC = () => {
  const pathname = usePathname();
  const doc = findDoc(pathname);
  const { title, description } = doc
    ? { title: doc.name, description: doc.description }
    : extraPages[pathname] ?? { title: 'Page', description: 'Welcome to our page!' };

  return (
    <div className="mb-12">
      {doc && <p className="text-secondary text-sm mb-2">{doc.group}</p>}
      <h1 className="text-[4rem] tracking-tight leading-tight">{title}</h1>
      <p className="text-md text-secondary font-light leading-5 mt-4 max-w-[44rem]">{description}</p>
    </div>
  );
};

export default Header01;
