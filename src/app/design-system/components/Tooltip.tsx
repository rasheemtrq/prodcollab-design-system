'use client';

import React, { useEffect, useId, useState } from 'react';

type TooltipProps = {
  text: string;
  children: React.ReactNode;
  /** Milliseconds before the tooltip appears. */
  delay?: number;
};

const Tooltip: React.FC<TooltipProps> = ({ text, children, delay = 800 }) => {
  const [visible, setVisible] = useState(false);
  const [delayedVisible, setDelayedVisible] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!visible) {
      setDelayedVisible(false);
      return;
    }
    const timeoutId = setTimeout(() => setDelayedVisible(true), delay);
    return () => clearTimeout(timeoutId);
  }, [visible, delay]);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        aria-describedby={id}
        className="border border-tertiary hover:bg-secondary transition-all ease-out duration-base px-4 py-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => e.key === 'Escape' && hide()}
      >
        {children}
      </button>
      <div
        id={id}
        role="tooltip"
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-nowrap bg-surface-inverse text-inverse text-xs rounded pointer-events-none
        z-10 transition-all ease-pc-out duration-fast ${delayedVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-75'}`}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
