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
      className={`relative inline-block ${sizeClasses[size]} rounded-full transition duration-200 delay-25 ease-in-out cursor-pointer ${
        isChecked ? 'bg-accent' : 'bg-tertiary'
      }`}
      onClick={handleToggle}
    >
      <div
        className={`absolute ${handleSizeClasses[size]} bg-white rounded-full border border-gray-200 shadow transition-transform duration-200 ease-in-out transform ${
          isChecked ? translateClasses[size] : 'translate-x-0'
        }`}
      />
    </div>
  );
};

export default Toggle;
