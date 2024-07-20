// src/utils/componentCode.ts

export const accordionCode = `
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
              className={\`flex flex-col bg-secondary \${isFirst ? 'rounded-t-xl' : ''} \${isLast ? 'rounded-b-xl' : ''}\`}
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
      className={\`w-9 h-9 border border-tertiary shadow-white shadow-2xl \${variantStyles[variant]}\`}
    />
  );
};

export default Avatar;
`;

export const alertCode = `
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
  avatarSize?: 'small' | 'medium';
  lineSize?: 'small' | 'medium';
};

const Skeleton: React.FC<SkeletonProps> = ({ avatarSize = 'small', lineSize = 'small' }) => {
  const avatarStyles = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
  };

  const lineStyles = {
    small: 'w-24 h-4',
    medium: 'w-48 h-6',
  };

  return (
    <div className="p-4 bg-primary rounded-xl border border-secondary inline-flex flex-row gap-4 items-start">
      <div className={\`rounded-full animate-pulse \${avatarStyles[avatarSize]}\`} />
      <div className="flex flex-col gap-2">
        <div className={\`rounded animate-pulse \${lineStyles[lineSize]}\`} />
        <div className={\`rounded animate-pulse \${lineStyles[lineSize]}\`} />
      </div>
    </div>
  );
};

export default Skeleton;

`;

export const toolTipCode = `
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

export const tabListCode = `
import { useState } from 'react';

interface TablistProps {
    tabs: string[];
    sizing?: 'xs' | 'sm' | 'md' | 'lg';
    amount?: number;
}

const Tablist: React.FC<TablistProps> = ({ tabs, sizing = 'xs', amount = tabs.length }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const sizeClasses: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
        xs: 'text-xs px-1 py-0.5',
        sm: 'text-sm px-2 py-1',
        md: 'text-md px-3 py-1.5',
        lg: 'text-lg px-4 py-2',
    };

    return (
        <div>
            <div className="p-1 rounded-lg border border-secondary justify-center items-center inline-flex gap-1">
                {tabs.slice(0, amount).map((tab) => (
                    <div
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={\`px-2 py-1 rounded justify-center items-center flex hover:bg-tertiary transition-all ease-in-out 200ms \${activeTab === tab ? 'bg-tertiary' : 'opacity-50'
                            } \${sizeClasses[sizing]}\`}
                    >
                        <div className="text-white">{tab}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tablist;
`;

export const toggleCode = `
import React, { useState } from 'react';

interface ToggleProps {
  size?: 'small' | 'medium' | 'large';
}

const Toggle: React.FC<ToggleProps> = ({ size = 'medium' }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const sizeClasses = {
    small: 'w-8 h-4',
    medium: 'w-12 h-6',
    large: 'w-16 h-8',
  };

  const handleSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  const translateClasses = {
    small: 'translate-x-4',
    medium: 'translate-x-6',
    large: 'translate-x-8',
  };

  return (
    <div
      className={\`relative inline-block \${sizeClasses[size]} rounded-full transition duration-200 delay-25 ease-in-out cursor-pointer
      \${isChecked ? 'bg-accent' : 'bg-tertiary'}\`}
      onClick={handleToggle}
    >
      <div
        className={\`absolute \${handleSizeClasses[size]} bg-white rounded-full border border-gray-200 shadow transition-transform duration-200 ease-in-out transform 
        \${isChecked ? translateClasses[size] : 'translate-x-0'}\`}
      />
    </div>
  );
};

export default Toggle;
`;