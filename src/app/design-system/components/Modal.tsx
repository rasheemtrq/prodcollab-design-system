import React, { ReactNode } from 'react';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
};

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children, variant = 'default' }) => {
  const variantStyles = {
    default: 'bg-white text-black',
    primary: 'bg-blue-100 text-blue-900',
    secondary: 'bg-gray-100 text-gray-900',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className={`relative p-4 rounded shadow-lg ${variantStyles[variant]}`}>
        <h2 className="font-bold mb-2">{title}</h2>
        <div>{children}</div>
        <button className="mt-4 px-4 py-2 rounded bg-red-500 text-white" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
