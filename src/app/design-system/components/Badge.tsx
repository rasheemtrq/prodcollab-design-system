import React from "react";

interface BadgeProps {
    variant?: 'notification' | 'pending' | 'error' | 'success';
}

const Badge: React.FC<BadgeProps> = ({ variant = 'notification' }) => {
    const variantStyles = {
        notification: 'bg-red-500',
        pending: 'bg-red-500',
        error: 'bg-red-500',
        success: ' g-red-500',
    }

    return (
        <div
            className={`rounded justify-center items-center flex hover:bg-tertiary ${variantStyles[variant]}`}
        />
    );
};
export default Badge;