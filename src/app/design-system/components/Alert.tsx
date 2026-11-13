import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

type AlertProps = {
  message: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
};

const variantStyles = {
  default: 'border-tertiary text-primary',
  success: 'border-success text-success',
  warning: 'border-warning text-warning',
  error: 'border-danger text-danger',
};

const variantIcons = {
  default: faInfoCircle,
  success: faCheckCircle,
  warning: faExclamationTriangle,
  error: faExclamationCircle,
};

const Alert: React.FC<AlertProps> = ({ message, variant = 'default' }) => (
  // Errors interrupt screen readers; everything else waits its turn.
  <div
    role={variant === 'error' ? 'alert' : 'status'}
    className={`p-3 rounded-xl flex gap-1 items-center text-sm bg-secondary border ${variantStyles[variant]}`}
  >
    <FontAwesomeIcon icon={variantIcons[variant]} className="mr-2" aria-hidden />
    <span>{message}</span>
  </div>
);

export default Alert;
