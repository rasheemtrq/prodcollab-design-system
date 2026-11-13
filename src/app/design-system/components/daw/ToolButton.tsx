import React from 'react';

type Tone = 'neutral' | 'accent' | 'mute' | 'solo' | 'record';

type ToolButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: React.ReactNode;
  /** Pressed (latched) state. Leave undefined for a plain momentary button. */
  pressed?: boolean;
  /** Color when pressed. */
  tone?: Tone;
  size?: 'xs' | 'sm' | 'md';
  /** Required when the content is only an icon or a single letter. */
  label?: string;
};

const pressedStyles: Record<Tone, string> = {
  neutral: 'bg-surface-inverse text-inverse',
  accent: 'bg-accent text-accent-ink',
  mute: 'bg-mute text-inverse',
  solo: 'bg-solo text-accent-ink',
  record: 'bg-record text-primary',
};

const sizeStyles = {
  xs: 'h-5 min-w-5 px-1 text-[10px] rounded-[4px]',
  sm: 'h-6 min-w-6 px-1.5 text-[11px] rounded-[5px]',
  md: 'h-7 min-w-7 px-2.5 text-xs rounded-[7px]',
};

const ToolButton: React.FC<ToolButtonProps> = ({
  children,
  pressed,
  tone = 'accent',
  size = 'sm',
  label,
  className = '',
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    aria-pressed={pressed}
    aria-label={label}
    title={label}
    className={`inline-flex items-center justify-center gap-1 font-semibold leading-none select-none transition-colors duration-fast outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 disabled:pointer-events-none ${
      pressed ? pressedStyles[tone] : 'bg-tertiary text-primary hover:bg-surface-3'
    } ${sizeStyles[size]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default ToolButton;
