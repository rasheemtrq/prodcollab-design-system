'use client';

import React, { useId, useState, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Define types for the props
type AccordionProps = {
  items: { title: string; content: ReactNode; }[];
  numberOfRows?: number;
};

const Accordion: React.FC<AccordionProps> = ({ items, numberOfRows = items.length }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const baseId = useId();

  const toggleAccordion = (index: number) => {
    setOpenIndexes(prevIndexes =>
      prevIndexes.includes(index)
        ? prevIndexes.filter(i => i !== index)
        : [...prevIndexes, index]
    );
  };

  return (
    <div className="w-full max-w-80 h-auto">
      {items.slice(0, numberOfRows).map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === numberOfRows - 1;
        const isOpen = openIndexes.includes(index);

        return (
          <div key={index}>
            <div
              className={`flex flex-col bg-secondary ${isFirst ? 'rounded-t-xl' : ''} ${isLast ? 'rounded-b-xl' : ''}`}
            >
              <button
                type="button"
                id={`${baseId}-h${index}`}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-p${index}`}
                className={`w-full text-left py-4 px-4 outline-none focus-visible:ring-2 focus-visible:ring-accent inline-flex items-center justify-between ${isFirst ? 'rounded-t-xl' : ''} ${isLast && !isOpen ? 'rounded-b-xl' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                {item.title}
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} aria-hidden />
              </button>
              {isOpen && (
                <div
                  id={`${baseId}-p${index}`}
                  role="region"
                  aria-labelledby={`${baseId}-h${index}`}
                  className="px-4 pb-6 text-secondary"
                >
                  {item.content}
                </div>
              )}
            </div>
            {!isLast && <hr className="border border-transparent" />}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
