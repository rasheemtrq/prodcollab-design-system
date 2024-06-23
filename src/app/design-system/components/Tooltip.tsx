import React, { useState, useEffect } from 'react';

type TooltipProps = {
  text: string;
  children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  const [delayedVisible, setDelayedVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (visible) {
      timeoutId = setTimeout(() => setDelayedVisible(true), 800);
    } else {
      setDelayedVisible(false);
    }
    return () => clearTimeout(timeoutId);
  }, [visible]);

  return (
    <div className="relative inline-block">
      <div
        className="cursor-pointer border border-tertiary hover:bg-secondary transition-all ease-out 200ms px-4 py-2 rounded-full"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      <div
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-nowrap bg-white text-black text-xs rounded
        z-10 transition-all ease-out-quad duration-120 ${ delayedVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-75'}`}
      >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;