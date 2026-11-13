import React from 'react';
import Image from 'next/image';

type AvatarProps = {
  src: string;
  alt: string;
  variant?: 'default' | 'round' | 'square';
  size?: 'sm' | 'md' | 'lg';
};

const variantStyles = {
  default: 'rounded-full',
  round: 'rounded-lg',
  square: 'rounded-none',
};

const sizes = { sm: 24, md: 36, lg: 48 };

const Avatar: React.FC<AvatarProps> = ({ src, alt, variant = 'default', size = 'md' }) => {
  const px = sizes[size];
  return (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      style={{ width: px, height: px }}
      className={`border border-tertiary object-cover ${variantStyles[variant]}`}
    />
  );
};

export default Avatar;
