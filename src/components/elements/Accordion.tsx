// components/Accordion.tsx
'use client'

import React, { useState } from 'react';
import Link from 'next/link';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  href?: string; // Optional href prop for the link functionality
}

const Accordion: React.FC<AccordionProps> = ({ title, children, href }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {href ? (
        <Link
            href={href}
            onClick={toggleAccordion}
            className="w-full flex justify-between items-center text-left pl-3 pr-4 py-2 focus:outline-none">
            <span>{title}</span>
            <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
        </Link>
      ) : (
        <div
          role="button"
          onClick={toggleAccordion}
          className="w-full flex justify-between items-center text-left pl-3 pr-4 py-2 focus:outline-none hover:underline cursor-pointer"
        >
          <span>{title}</span>
          <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
        </div>
      )}
      {isOpen && (
        <div className="pl-4 pt-4 pb-4 border-t border-tertiary">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
