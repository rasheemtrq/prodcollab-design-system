import React, { useState, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

// Define types for the props
type AccordionProps = {
  title: string;
  children: ReactNode;
  variant?: 'default' | 'medium' | 'large';
};

const Accordion: React.FC<AccordionProps> = ({ title, children, variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  // Define styles for different variants
  const variantStyles = {
    default: 'text-sm',
    medium: 'text-md',
    large: 'text-xl',
  };

  return (
    <Link href="#" className={`${variantStyles[variant]}`}>
      <button
        className="w-48 text-left py-2 px-3 focus:outline-none text-white flex items-center justify-between border border-transparent bg-secondary hover:border-tertiary rounded-lg transition-all ease-out 200ms"
        onClick={toggleAccordion}
      >
        {title}
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </button>
      {isOpen && (
        <div className="px-4 py-2">
          {children}
        </div>
      )}
    </Link>
  );
};

export default Accordion;
