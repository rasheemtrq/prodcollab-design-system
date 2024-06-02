'use client'

import React, { useState } from 'react';

interface InputFieldProps {
  disabled?: boolean;
  label: string;
  variant: 'error' | 'outlined' | 'password' | 'default';
}

const InputField: React.FC<InputFieldProps> = ({ disabled, label = 'Type here', variant }) => {
  const [showAsterisk, setShowAsterisk] = useState(true);

  // Determine input field color and additional classes based on variant
  let inputStateClass = '';
  let inputLabelClass = '';
  let inputType = 'text';

  switch (variant) {
    case 'error':
      inputStateClass = 'border border-red-500 text-black';
      inputLabelClass = 'block';
      break;
    case 'outlined':
      inputStateClass = 'bg-transparent border-2 border-tertiary text-gray-600';
      inputLabelClass = 'hidden';
      break;
    case 'password':
      inputType = 'password';
      inputStateClass = 'border border-gray-200 text-black';
      inputLabelClass = 'hidden';
      break;
    default:
      inputStateClass = 'border border-gray-200 text-black';
      inputLabelClass = 'hidden';
  }

  return (
    <div className="flex flex-col relative">
      <input
        type={inputType}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg font-custom ${inputStateClass}`}
        placeholder={label.replace('*', '')} // Removing the asterisk from the placeholder
        onFocus={() => setShowAsterisk(false)}
        onBlur={() => setShowAsterisk(true)}
      />
      {showAsterisk && (
        <span className="absolute right-3 top-5 transform -translate-y-1/2 text-red-500">*</span>
      )}
      {/* Error Message */}
      <label className={`text-red-500 text-xs mt-1 ${inputLabelClass}`}>
        Invalid input. Please try again.
      </label>
    </div>
  );
};

export default InputField;