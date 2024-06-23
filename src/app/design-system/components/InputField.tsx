// src/components/elements/InputField.tsx
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
        return 'border border-red-500 text-white';
      case 'outlined':
        return 'bg-transparent border-2 border-tertiary placeholder:text-gray-500 text-white';
      case 'password':
        return 'border border-tertiary text-white';
      default:
        return 'border border-tertiary text-white';
    }
  };

  const inputStateClass = getInputStateClasses();
  const inputType = variant === 'password' ? 'password' : 'text';

  return (
    <div className="flex flex-col relative">
      <input
        type={inputType}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg bg-secondary ${inputStateClass}`}
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
