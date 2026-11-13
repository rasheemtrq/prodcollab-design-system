'use client';

import React, { useState } from 'react';

interface ToggleProps {
  size?: 'small' | 'medium' | 'large';
  /** Controlled state. Leave undefined to let the toggle manage itself. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Accessible name, required when there is no visible label next to it. */
  label?: string;
}

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

const Toggle: React.FC<ToggleProps> = ({
  size = 'medium',
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  label = 'Toggle',
}) => {
  const [inner, setInner] = useState(defaultChecked);
  const isChecked = checked ?? inner;

  const handleToggle = () => {
    if (checked === undefined) setInner(!isChecked);
    onChange?.(!isChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      disabled={disabled}
      onClick={handleToggle}
      className={`relative inline-block shrink-0 ${sizeClasses[size]} rounded-full transition-colors duration-base ease-pc-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 ${
        isChecked ? 'bg-accent' : 'bg-tertiary'
      }`}
    >
      <span
        className={`absolute left-0 top-0 ${handleSizeClasses[size]} bg-white rounded-full border border-gray-200 shadow transition-transform duration-base ease-pc-out ${
          isChecked ? translateClasses[size] : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default Toggle;
