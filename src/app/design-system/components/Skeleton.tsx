import React from 'react';
import '@/app/styles/skeleton.css'; // Skeleton Animation

type SkeletonProps = {
  avatarSize?: 'default' | 'medium' ;
  lineSize?: 'default' | 'medium' ;
};

const Skeleton: React.FC<SkeletonProps> = ({ avatarSize = 'default', lineSize = 'default' }) => {
  const avatarClasses = {
    default: 'w-10 h-10',
    medium: 'w-16 h-16',
  };

  const lineClasses = {
    default: 'w-24 h-4',
    medium: 'w-48 h-6',
  };

  return (
    <div className="p-4 bg-secondary rounded-xl border border-tertiary inline-flex flex-row gap-4 items-start">
      <div className={`rounded-full animate-pulse ${avatarClasses[avatarSize]}`} />
      <div className="flex flex-col gap-2">
        <div className={`rounded animate-pulse ${lineClasses[lineSize]}`} />
        <div className={`rounded animate-pulse ${lineClasses[lineSize]}`} />
      </div>
    </div>
  );
};

export default Skeleton;
