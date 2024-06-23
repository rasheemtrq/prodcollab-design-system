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
    <div className={`p-3 rounded-xl flex gap-1 items-center text-sm ${variantStyles[variant]}`}>
      <FontAwesomeIcon icon={variantIcons[variant]} className="mr-2" />
      {message}
    </div>
  );
};

export default Alert;
