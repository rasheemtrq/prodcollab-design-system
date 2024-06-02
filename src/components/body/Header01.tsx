'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Header01: React.FC = () => {
  const pathname = usePathname();

  const getPageDetails = (path: string) => {
    switch (path) {
      case '/':
        return { title: 'ProdCollab Design System', description: 'A comprehensive style guide and UI component library made to work with Webflow and React for streamlined development.' };
      case '/about':
        return { title: 'About Us', description: 'Learn more about our team and mission.' };
      case '/contact':
        return { title: 'Contact Us', description: 'Get in touch with us.' };
      case '/ui-library':
        return { title: 'UI Library', description: 'View our library of custom components!' };
      case '/ui-library/elements':
        return { title: 'Elements', description: 'View our collection of custom elements!' };
      case '/ui-library/web-blocks':
        return { title: 'Web Blocks', description: 'View our collection of custom web blocks!' };
      case '/colors':
        return { title: 'Colors', description: 'Explore our color palette.' };
      default:
        return { title: 'Page', description: 'Welcome to our page!' };
    }
  };

  const { title, description } = getPageDetails(pathname);

  return (
    <div className="mb-12">
      <h1 className="text-[4rem] font-normal tracking-tight">{title}</h1>
      <div className="h-1 overflow-hidden rounded-full">
      <Image
      className=""
      src="/images/gradient.jpg"
      alt="Colorful underline"
      width={1920}
      height={100}
      />
      </div>
      <p className="text-lg font-normal text-secondary leading-6 mt-4">{description}</p>
    </div>
  );
};

export default Header01;
