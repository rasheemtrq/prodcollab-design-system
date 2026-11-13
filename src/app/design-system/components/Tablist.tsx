'use client';

import React, { useRef, useState } from 'react';

type Size = 'xs' | 'sm' | 'md' | 'lg';

interface TablistProps {
  tabs: string[];
  sizing?: Size;
  amount?: number;
  /** Controlled active tab. Leave undefined to let the list manage itself. */
  value?: string;
  onChange?: (tab: string) => void;
  /** Accessible name for the group, e.g. "Editor view". */
  label?: string;
}

const sizeClasses: Record<Size, string> = {
  xs: 'text-xs px-1 py-0.5',
  sm: 'text-sm px-2 py-1',
  md: 'text-md px-3 py-1.5',
  lg: 'text-lg px-4 py-2',
};

const Tablist: React.FC<TablistProps> = ({ tabs, sizing = 'xs', amount = tabs.length, value, onChange, label }) => {
  const shown = tabs.slice(0, amount);
  const [inner, setInner] = useState(shown[0]);
  const active = value ?? inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (tab: string) => {
    if (value === undefined) setInner(tab);
    onChange?.(tab);
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = shown.length - 1;
    const next =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    refs.current[next]?.focus();
    select(shown[next]);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className="p-1 rounded-lg border border-secondary justify-center items-center inline-flex gap-1"
    >
      {shown.map((tab, i) => {
        const selected = active === tab;
        return (
          <button
            key={tab}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(tab)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`rounded justify-center items-center flex text-primary hover:bg-tertiary transition-all ease-in-out duration-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              selected ? 'bg-tertiary' : 'opacity-50 hover:opacity-100'
            } ${sizeClasses[sizing]}`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

export default Tablist;
