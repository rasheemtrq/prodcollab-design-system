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
      className={`px-4 py-2 rounded-full text-sm bg-opacity-100 hover:bg-opacity-80 transition-all ease-out 200ms ${variantStyles[variant]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;