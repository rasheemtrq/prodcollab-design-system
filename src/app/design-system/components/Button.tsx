import React from 'react';

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'error';
  size?: 'sm' | 'md' | 'lg';
};

const variantStyles = {
  default: 'bg-surface-inverse text-inverse hover:opacity-85',
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  secondary: 'bg-tertiary text-primary hover:bg-surface-3',
  error: 'bg-danger text-inverse hover:brightness-110',
};

const sizeStyles = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'default',
  size = 'md',
  type = 'button',
  className = '',
  ...rest
}) => (
  <button
    type={type}
    className={`rounded-full transition-all ease-pc-out duration-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    {...rest}
  >
    {label}
  </button>
);

export default Button;
