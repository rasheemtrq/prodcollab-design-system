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
    <div className={`flex items-center justify-between px-2 py-1 rounded-full text-xs ${variantStyles[variant]}`}>
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
