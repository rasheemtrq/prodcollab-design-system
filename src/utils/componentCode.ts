// src/utils/componentCode.ts
export const accordionCode = `
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
    <Link href="#" className={\`\${variantStyles[variant]}\`}>
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
`;


export const buttonCode = `
import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'error';
};

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-gray-200 text-black',
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-tertiary text-white',
    error: 'bg-red-500 text-white'
  };

  return (
    <button
      className={\`px-4 py-2 rounded-full text-sm bg-opacity-100 hover:bg-opacity-80 transition-all ease-out 200ms \${variantStyles[variant]}\`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;

`;

export const inputFieldCode = `
'use client'

import React, { useState } from 'react';

interface InputFieldProps {
  disabled?: boolean;
  label: string;
  variant: 'error' | 'outlined' | 'password' | 'default';
}

const InputField: React.FC<InputFieldProps> = ({ disabled, label = 'Type here', variant }) => {
  const [showAsterisk, setShowAsterisk] = useState(true);

  const getInputStateClasses = () => {
    switch (variant) {
      case 'error':
        return 'border border-red-500 text-black';
      case 'outlined':
        return 'bg-transparent border-2 border-tertiary text-white';
      case 'password':
        return 'border border-gray-200 text-black';
      default:
        return 'border border-gray-200 text-black';
    }
  };

  const inputStateClass = getInputStateClasses();
  const inputLabelClass = variant === 'error' ? 'block' : 'hidden';
  const inputType = variant === 'password' ? 'password' : 'text';

  return (
    <div className="flex flex-col mb-4 relative">
      <input
        type={inputType}
        disabled={disabled}
        className={\`px-4 py-2 rounded-lg font-custom \${inputStateClass}\`}
        placeholder={label.replace('*', '')} // Removing the asterisk from the placeholder
        onFocus={() => setShowAsterisk(false)}
        onBlur={() => setShowAsterisk(true)}
      />
      {showAsterisk && (
        <span className="absolute right-3 top-5 transform -translate-y-1/2 text-red-500">*</span>
      )}
      {variant === 'error' && (
        <label className="text-red-500 text-xs mt-1 block">
          Invalid input. Please try again.
        </label>
      )}
    </div>
  );
};

export default InputField;
`;

export const chipCode = `
import React from 'react';

type ChipProps = {
  text: string;
  variant?: 'default' | 'primary' | 'secondary';
};

const Chip: React.FC<ChipProps> = ({ text, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-gray-200 text-black',
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-tertiary text-white',
  };
  return (
    <div className={\`flex items-center justify-between px-2 py-1 rounded-full text-xs \${variantStyles[variant]}\`}>
      <div className="w-2 h-2 rounded-full mr-1.5 stroke-current">
        {/* Icon Here */}
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7.5" />
        </svg>
      </div>

      <span>{text}</span>
    </div>
  );
};

export default Chip;
`;

export const avatarCode = `
import React from 'react';
import Image from 'next/image';

type AvatarProps = {
  src: string;
  alt: string;
  variant?: 'default' | 'round' | 'square';
};

const Avatar: React.FC<AvatarProps> = ({ src, alt, variant = 'default' }) => {
  const variantStyles = {
    default: 'rounded-full',
    round: 'rounded-lg',
    square: 'rounded-none',
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={36} height={36}
      className={\`border border-tertiary shadow-white shadow-2xl \${variantStyles[variant]}\`}
    />
  );
};

export default Avatar;
`;

export const alertCode =`
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

type AlertProps = {
  message: string;
  variant?: 'default' | 'success' | 'error';
};

const Alert: React.FC<AlertProps> = ({ message, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-secondary border border-tertiary text-white',
    success: 'bg-secondary border border-green-500 text-green-300',
    error: 'bg-secondary border border-red-500 text-red-300',
  };

  const variantIcons = {
    default: faInfoCircle,
    success: faCheckCircle,
    error: faExclamationCircle,
  };

  return (
    <div className={\`p-3 rounded-xl flex gap-1 items-center text-sm \${variantStyles[variant]}\`}>
      <FontAwesomeIcon icon={variantIcons[variant]} className="mr-2" />
      {message}
    </div>
  );
};

export default Alert;
`;

export const cardCode = `
import React from 'react';
import Avatar from '../components/Avatar';

type CardProps = {
  title: string;
  content: string;
  variant?: 'default' | 'primary' | 'secondary';
};

const Card: React.FC<CardProps> = ({ title, content, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-white text-black',
    primary: 'bg-blue-100 text-blue-900',
    secondary: 'bg-tertiary text-white',
  };

  return (
    <div className={\`py-2 pl-2 pr-3 rounded-xl \${variantStyles[variant]}\`}>
      <div className="flex flex-row gap-2">
        <Avatar
          src="/images/logo-256.png"
          alt="user"
        />
        <div>
          <h2 className="font-semibold mb-1">{title}</h2>
          <p className="leading-4 text-sm mb-1">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
`;

export const skeletonCode = `
import React from 'react';
import '@/app/styles/skeleton.css'; // Skeleton Animation

type SkeletonProps = {
  avatarSize?: 'default' | 'medium' ;
  lineSize?: 'default' | 'medium' ;
};

const Skeleton: React.FC<SkeletonProps> = ({ avatarSize = 'default', lineSize = 'default' }) => {
  const avatarClasses = {
    default: 'w-10 h-10',
    medium: 'w-16 h-16',
  };

  const lineClasses = {
    default: 'w-24 h-4',
    medium: 'w-48 h-6',
  };

  return (
    <div className="p-4 bg-secondary rounded-xl border border-tertiary inline-flex flex-row gap-4 items-start">
      <div className={\`rounded-full animate-pulse \${avatarClasses[avatarSize]}\`} />
      <div className="flex flex-col gap-2">
        <div className={\`rounded animate-pulse \${lineClasses[lineSize]}\`} />
        <div className={\`rounded animate-pulse \${lineClasses[lineSize]}\`} />
      </div>
    </div>
  );
};

export default Skeleton;
`;

export const tooltipCode = `
import React, { useState, useEffect } from 'react';

type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [delayedVisible, setDelayedVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (visible) {
      timeoutId = setTimeout(() => setDelayedVisible(true), 800);
    } else {
      setDelayedVisible(false);
    }
    return () => clearTimeout(timeoutId);
  }, [visible]);

  return (
    <div className="relative inline-block">
      <div
        className="cursor-pointer border border-tertiary hover:bg-secondary transition-all ease-out 200ms px-4 py-2 rounded-full"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      <div
        className={\`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-nowrap bg-white text-black text-xs rounded
        z-10 transition-all ease-out-quad duration-120 \${ delayedVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-75'}\`}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
`;