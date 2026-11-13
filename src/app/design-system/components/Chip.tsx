import React from 'react';

type ChipProps = {
  text: string;
  variant?: 'default' | 'primary' | 'secondary';
  /** Dot color, e.g. a track color. Defaults to the text color. */
  dotColor?: string;
};

const variantStyles = {
  default: 'bg-surface-inverse text-inverse',
  primary: 'bg-accent text-accent-ink',
  secondary: 'bg-tertiary text-primary',
};

const Chip: React.FC<ChipProps> = ({ text, variant = 'default', dotColor }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${variantStyles[variant]}`}>
    <span
      aria-hidden
      className="w-2 h-2 rounded-full mr-1.5 border border-current"
      style={dotColor ? { background: dotColor, borderColor: dotColor } : undefined}
    />
    <span>{text}</span>
  </span>
);

export default Chip;
