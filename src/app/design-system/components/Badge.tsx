import React from 'react';

type BadgeProps = {
  variant?: 'notification' | 'pending' | 'error' | 'success';
  /** A number shows a count (capped at 99+); omit it for a dot. */
  count?: number;
  /** Accessible description, e.g. "3 unread comments". */
  label?: string;
  /** Wraps children and pins the badge to their top-right corner. */
  children?: React.ReactNode;
};

const variantStyles = {
  notification: 'bg-accent text-accent-ink',
  pending: 'bg-warning text-inverse',
  error: 'bg-danger text-inverse',
  success: 'bg-success text-inverse',
};

const Badge: React.FC<BadgeProps> = ({ variant = 'notification', count, label, children }) => {
  const isDot = count === undefined;
  const text = !isDot && count > 99 ? '99+' : count;

  const badge = (
    <span
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-flex items-center justify-center rounded-full font-semibold leading-none ring-2 ring-[var(--pc-surface-0)] ${
        isDot ? 'w-2.5 h-2.5' : 'min-w-[1.25rem] h-5 px-1.5 text-[11px]'
      } ${variantStyles[variant]}`}
    >
      {!isDot && text}
    </span>
  );

  if (!children) return badge;

  return (
    <span className="relative inline-flex">
      {children}
      <span className="absolute -top-1 -right-1">{badge}</span>
    </span>
  );
};

export default Badge;
