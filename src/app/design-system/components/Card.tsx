import React from 'react';
import Avatar from '../components/Avatar';

type CardProps = {
  title: string;
  content: string;
  variant?: 'default' | 'primary' | 'secondary';
  avatarSrc?: string;
  avatarAlt?: string;
};

const variantStyles = {
  default: 'bg-secondary border border-tertiary text-primary',
  primary: 'bg-[color-mix(in_srgb,var(--pc-accent)_18%,var(--pc-surface-1))] border border-[color-mix(in_srgb,var(--pc-accent)_45%,transparent)] text-primary',
  secondary: 'bg-tertiary border border-transparent text-primary',
};

const Card: React.FC<CardProps> = ({
  title,
  content,
  variant = 'default',
  avatarSrc = '/images/logo-256.png',
  avatarAlt = '',
}) => (
  <div className={`py-2 pl-2 pr-3 rounded-xl ${variantStyles[variant]}`}>
    <div className="flex flex-row gap-2">
      <Avatar src={avatarSrc} alt={avatarAlt} />
      <div>
        <h2 className="font-semibold mb-1">{title}</h2>
        <p className="leading-4 text-sm mb-1 text-secondary">{content}</p>
      </div>
    </div>
  </div>
);

export default Card;
