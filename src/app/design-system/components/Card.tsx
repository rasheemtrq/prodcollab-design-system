import React from 'react';
import Avatar from '../components/Avatar';

type CardProps = {
  title: string;
  content: string;
  variant?: 'default' | 'primary' | 'secondary';
};

const Card: React.FC<CardProps> = ({ title, content, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-white text-black',
    primary: 'bg-blue-100 text-blue-900',
    secondary: 'bg-tertiary text-white',
  };

  return (
    <div className={`py-2 pl-2 pr-3 rounded-xl ${variantStyles[variant]}`}>
      <div className="flex flex-row gap-2">
        <Avatar
          src="/images/logo-256.png"
          alt="user"
        />
        <div>
          <h2 className="font-semibold mb-1">{title}</h2>
          <p className="leading-4 text-sm mb-1">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;

