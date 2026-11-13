'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type PopoverAnchor = HTMLElement | { x: number; y: number } | null;
export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'right-start';

type PopoverProps = {
  open: boolean;
  /** An element to sit next to, or a viewport point (for context menus). */
  anchor: PopoverAnchor;
  placement?: PopoverPlacement;
  /** Called on Escape or a pointer press outside both the popover and the anchor element. */
  onClose: (reason: 'escape' | 'outside') => void;
  children: React.ReactNode;
  /**
   * Render into document.body (default) so parents with overflow: hidden
   * cannot clip it. Nested popovers such as submenus pass false so they stay
   * inside their parent's DOM and count as "inside" for outside clicks.
   */
  portal?: boolean;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'children'>;

const GAP = 4;
const MARGIN = 8;

/**
 * Positions `children` next to an anchor, flipping to the other side when it
 * would leave the viewport, and keeps the position right while the page
 * scrolls or resizes. It has no styling of its own.
 */
const Popover: React.FC<PopoverProps> = ({
  open,
  anchor,
  placement = 'bottom-start',
  onClose,
  children,
  portal = true,
  className = '',
  style,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const place = () => {
      const el = ref.current;
      if (!el || !anchor) return;
      const a =
        anchor instanceof HTMLElement
          ? anchor.getBoundingClientRect()
          : { left: anchor.x, right: anchor.x, top: anchor.y, bottom: anchor.y, width: 0, height: 0 };
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left: number;
      let top: number;
      if (placement === 'right-start') {
        left = a.right + GAP;
        if (left + w > vw - MARGIN) left = a.left - GAP - w; // flip to the left
        top = a.top - 4;
        if (top + h > vh - MARGIN) top = vh - MARGIN - h;
      } else {
        left = placement === 'bottom-end' ? a.right - w : a.left;
        top = a.bottom + GAP;
        if (top + h > vh - MARGIN && a.top - GAP - h >= MARGIN) top = a.top - GAP - h; // flip up
      }
      left = Math.min(Math.max(MARGIN, left), vw - MARGIN - w);
      top = Math.min(Math.max(MARGIN, top), vh - MARGIN - h);
      setPos({ left, top });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
    // `mounted`: a freshly mounted popover (e.g. a submenu) renders nothing on
    // its first pass, so it must measure again once its node exists.
  }, [open, anchor, placement, mounted]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t)) return;
      if (anchor instanceof HTMLElement && anchor.contains(t)) return;
      close.current('outside');
    };
    // Capture so a click that also opens something else still closes this first.
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [open, anchor]);

  if (!open || !mounted) return null;

  const node = (
    <div
      ref={ref}
      {...rest}
      onKeyDown={(e) => {
        rest.onKeyDown?.(e);
        if (!e.defaultPrevented && e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          close.current('escape');
        }
      }}
      className={`fixed z-[60] ${className}`}
      // Transparent until measured so it never flashes at the wrong spot. Not
      // visibility: hidden, because content must be focusable on its first render.
      style={{ left: pos?.left ?? 0, top: pos?.top ?? 0, opacity: pos ? 1 : 0, pointerEvents: pos ? undefined : 'none', ...style }}
    >
      {children}
    </div>
  );

  return portal ? createPortal(node, document.body) : node;
};

export default Popover;
