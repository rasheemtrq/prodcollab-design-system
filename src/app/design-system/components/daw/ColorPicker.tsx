'use client';

import React, { useRef, useState } from 'react';
import Popover from '../Popover';
import type { MenuItem } from '../Menu';
import { trackColor, type TrackColor, type TrackSwatch } from './color';

export const TRACK_COLORS: readonly TrackSwatch[] = [1, 2, 3, 4, 5, 6, 7, 8];
export const TRACK_COLOR_NAMES = ['Blue', 'Violet', 'Pink', 'Red', 'Orange', 'Yellow', 'Green', 'Cyan'];

/** "Pink" for 3, or the CSS string itself for a custom color. */
export const trackColorName = (c: TrackColor) => (typeof c === 'number' ? TRACK_COLOR_NAMES[c - 1] : c);

type ColorPickerProps = {
  value: TrackColor;
  onChange: (color: TrackSwatch) => void;
  label?: string;
  /** Swatches per row; arrow keys follow this grid. */
  columns?: number;
  size?: 'sm' | 'md';
  /** Focus the selected swatch on mount (used inside popovers). */
  autoFocus?: boolean;
};

/**
 * The eight track swatches as a radio group. Arrow keys move and select,
 * Home and End jump to the first and last swatch.
 */
const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label = 'Track color', columns = 4, size = 'md', autoFocus }) => {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = TRACK_COLORS.findIndex((c) => c === value);
  const px = size === 'sm' ? 20 : 28;

  const choose = (i: number) => {
    const n = TRACK_COLORS.length;
    const at = (i + n) % n;
    onChange(TRACK_COLORS[at]);
    refs.current[at]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const map: Record<string, number> = {
      ArrowRight: i + 1,
      ArrowLeft: i - 1,
      ArrowDown: i + columns,
      ArrowUp: i - columns,
      Home: 0,
      End: TRACK_COLORS.length - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      choose(map[e.key]);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, ${px}px)` }}
    >
      {TRACK_COLORS.map((c, i) => {
        const on = i === selected;
        return (
          <button
            key={c}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={TRACK_COLOR_NAMES[i]}
            title={TRACK_COLOR_NAMES[i]}
            // Roving tabindex: only the chosen swatch (or the first) is in the tab order.
            tabIndex={on || (selected < 0 && i === 0) ? 0 : -1}
            autoFocus={autoFocus && (on || (selected < 0 && i === 0))}
            onClick={() => choose(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`rounded-full outline-none transition-transform duration-fast hover:scale-110 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pc-surface-1)] focus-visible:ring-white ${
              on ? 'ring-2 ring-offset-2 ring-offset-[var(--pc-surface-1)] ring-white' : ''
            }`}
            style={{ width: px, height: px, background: trackColor(c) }}
          />
        );
      })}
    </div>
  );
};

type ColorPickerButtonProps = Omit<ColorPickerProps, 'autoFocus'>;

/** A swatch button that opens the picker in a popover and closes once a color is chosen with a click. */
export const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({ value, onChange, label = 'Track color', ...rest }) => {
  const button = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  };

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label}: ${trackColorName(value)}`}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 h-8 pl-1.5 pr-2.5 rounded-pc-md bg-tertiary hover:bg-surface-3 text-sm transition-colors duration-fast outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span aria-hidden className="w-5 h-5 rounded-full" style={{ background: trackColor(value) }} />
        {trackColorName(value)}
      </button>
      <Popover
        open={open}
        anchor={button.current}
        onClose={(why) => close(why === 'escape')}
        role="dialog"
        aria-label={label}
        className="p-3 rounded-pc-lg bg-secondary border border-line-strong shadow-2xl"
      >
        <div
          // A pointer pick closes the popover; keyboard picks keep it open so arrows can browse. Enter closes.
          onClick={(e) => (e.target as HTMLElement).closest('[role="radio"]') && e.detail > 0 && close(true)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), close(true))}
        >
          <ColorPicker value={value} onChange={onChange} label={label} autoFocus {...rest} />
        </div>
      </Popover>
    </>
  );
};

/**
 * The swatches as menu radio items, for a "Color" submenu in a track menu:
 * `{ type: 'submenu', label: 'Color', items: colorMenuItems(color, setColor) }`.
 */
export const colorMenuItems = (value: TrackColor, onChange: (color: TrackSwatch) => void): MenuItem[] =>
  TRACK_COLORS.map((c, i) => ({
    label: TRACK_COLOR_NAMES[i],
    radio: true,
    checked: value === c,
    icon: <span className="block w-3 h-3 rounded-full" style={{ background: trackColor(c) }} />,
    onSelect: () => onChange(c),
  }));

export default ColorPicker;
