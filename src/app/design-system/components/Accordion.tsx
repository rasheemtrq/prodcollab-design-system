import React, { useState, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Define types for the props
type AccordionProps = {
  items: { title: string; content: ReactNode; }[];
  numberOfRows?: number;
};

const Accordion: React.FC<AccordionProps> = ({ items, numberOfRows = items.length }) => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

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
              style={{
                overflow: 'hidden', // Ensure hidden overflow for smooth transition
                transition: 'height 0.3s ease-in-out', // Smooth height transition
                height: isOpen ? 'auto' : 'fit-content', // Auto height when open, fit-content when closed
              }}
            >
              <button
                className="w-full text-left py-4 px-4 focus:outline-none inline-flex items-center justify-between"
                onClick={() => toggleAccordion(index)}
              >
                {item.title}
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
              </button>
              {isOpen && (
                <div className="px-4 pb-6 text-white text-opacity-50">
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
