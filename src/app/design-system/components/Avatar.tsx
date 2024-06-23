import React from 'react';

type AvatarProps = {
  src: string;
  alt: string;
  variant?: 'default' | 'round' | 'square';
};

const Avatar: React.FC<AvatarProps> = ({ src, alt, variant = 'default' }) => {
  const variantStyles = {
    default: 'rounded-full',
    round: 'rounded-lg',
    square: 'rounded-none',
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`w-9 h-9 border border-tertiary shadow-white shadow-2xl ${variantStyles[variant]}`}
    />
  );
};

export default Avatar;
