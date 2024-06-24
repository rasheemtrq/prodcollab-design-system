import React from 'react';
import Image from 'next/image';

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
    <Image
      src={src}
      alt={alt}
      width={36} height={36}
      className={`border border-tertiary shadow-white shadow-2xl ${variantStyles[variant]}`}
    />
  );
};

export default Avatar;
