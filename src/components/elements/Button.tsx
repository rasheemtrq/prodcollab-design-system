// src/components/elements/Button.tsx
'use client'

import React from 'react';

interface ButtonProps {
  onClick?: () => void; // Make sure onClick is optional
  disabled?: boolean;
  text?: string;
  variant?: 'secondary' | 'error' | 'default';
}

const Button: React.FC<ButtonProps> = ({
  onClick = () => {}, // Provide a default function to prevent onClick from being null
  disabled = false,
  text = 'Button',
  variant = 'default'
}) => {
  // Determine button color based on variant
  let buttonColorClass = '';
  switch (variant) {
    case 'error':
      buttonColorClass = 'bg-red-500 hover:bg-red-600 text-white';
      break;
    case 'secondary':
      buttonColorClass = 'border border-tertiary hover:bg-tertiary text-white';
      break;
    default:
      buttonColorClass = 'bg-blue-500 hover:bg-blue-600 text-white';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-full transition-all ease-out duration-100 ${buttonColorClass}`}
    >
      {text}
    </button>
  );
};

export default Button;

