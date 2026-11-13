'use client';

import React, { ReactNode, useEffect, useId, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Buttons for the footer. Defaults to a single Close button. */
  actions?: ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
};

const variantStyles = {
  default: 'bg-secondary border-tertiary',
  primary: 'bg-secondary border-accent',
  secondary: 'bg-tertiary border-line-strong',
};

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children, actions, variant = 'default' }) => {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // Held in a ref so an inline onClose does not re-run the focus effect.
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const first = panel.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel.current)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close.current();
        return;
      }
      // Keep Tab inside the dialog.
      if (e.key !== 'Tab' || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const [head, tail] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === head) {
        e.preventDefault();
        tail.focus();
      } else if (!e.shiftKey && document.activeElement === tail) {
        e.preventDefault();
        head.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative w-full max-w-md p-6 rounded-2xl border shadow-2xl text-primary outline-none ${variantStyles[variant]}`}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 id={titleId} className="text-lg font-semibold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 -mt-1 -mr-2 rounded-full text-secondary hover:text-primary hover:bg-tertiary transition-colors duration-base"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="text-sm text-secondary leading-5">{children}</div>
        <div className="flex justify-end gap-2 mt-6">
          {actions ?? (
            <button
              type="button"
              className="px-4 py-2 rounded-full text-sm bg-tertiary hover:bg-surface-3 transition-colors duration-base"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
