import React from 'react';
import '@/app/styles/skeleton.css'; // Skeleton Animation

type SkeletonProps = {
  avatarSize?: 'small' | 'medium';
  lineSize?: 'small' | 'medium';
};

const Skeleton: React.FC<SkeletonProps> = ({ avatarSize = 'small', lineSize = 'small' }) => {
  const avatarStyles = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
  };

  const lineStyles = {
    small: 'w-24 h-4',
    medium: 'w-48 h-6',
  };

  return (
    <div className="p-4 bg-primary rounded-xl border border-secondary inline-flex flex-row gap-4 items-start">
      <div className={`rounded-full animate-pulse ${avatarStyles[avatarSize]}`} />
      <div className="flex flex-col gap-2">
        <div className={`rounded animate-pulse ${lineStyles[lineSize]}`} />
        <div className={`rounded animate-pulse ${lineStyles[lineSize]}`} />
      </div>
    </div>
  );
};

export default Skeleton;
