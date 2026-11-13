'use client';

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronRight, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import Popover, { type PopoverAnchor, type PopoverPlacement } from './Popover';

export type MenuAction = {
  type?: 'item';
  label: string;
  onSelect?: () => void;
  /** Shown right-aligned, e.g. "Ctrl+D". Display only; bind the key yourself. */
  shortcut?: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  /** Makes it a checkbox (true/false) item. */
  checked?: boolean;
  /** With `checked`, makes it one choice of a group (menuitemradio). */
  radio?: boolean;
  /** Keep the menu open after choosing, e.g. for toggles. */
  keepOpen?: boolean;
};
export type MenuSubmenu = { type: 'submenu'; label: string; items: MenuItem[]; icon?: React.ReactNode; disabled?: boolean };
export type MenuSeparator = { type: 'separator' };
export type MenuLabel = { type: 'label'; label: string };
export type MenuItem = MenuAction | MenuSubmenu | MenuSeparator | MenuLabel;

const isFocusable = (item: MenuItem): item is MenuAction | MenuSubmenu =>
  (item.type === undefined || item.type === 'item' || item.type === 'submenu') && !item.disabled;

// ----------------------------------------------------------------- list

type ListProps = {
  items: MenuItem[];
  label: string;
  /** Close this level only (Escape / ArrowLeft in a submenu). */
  onDismiss: () => void;
  /** Close every level, after choosing an item or on Tab. */
  onCloseAll: (refocus: boolean) => void;
  initialFocus: 'first' | 'last';
  submenu?: boolean;
};

const MenuList: React.FC<ListProps> = ({ items, label, onDismiss, onCloseAll, initialFocus, submenu }) => {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(-1);
  // Mirrors `active` for key handlers, which can run before React re-renders.
  const activeRef = useRef(-1);
  const [openSub, setOpenSub] = useState<{ index: number; focus: 'first' | 'last' | 'none' } | null>(null);
  const focusable = items.map((it, i) => (isFocusable(it) ? i : -1)).filter((i) => i >= 0);

  const focusAt = useCallback((i: number) => {
    activeRef.current = i;
    setActive(i);
    refs.current[i]?.focus();
  }, []);

  useEffect(() => {
    // A group of radio items (e.g. Color) opens on the current choice.
    const current = items.findIndex((it) => isFocusable(it) && (it as MenuAction).radio && (it as MenuAction).checked);
    const start = initialFocus === 'last' ? focusable[focusable.length - 1] : current >= 0 ? current : focusable[0];
    if (start !== undefined) focusAt(start);
    else refs.current[0]?.parentElement?.focus();
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = (dir: 1 | -1) => {
    if (focusable.length === 0) return;
    const at = focusable.indexOf(active);
    const next = at < 0 ? (dir > 0 ? 0 : focusable.length - 1) : (at + dir + focusable.length) % focusable.length;
    focusAt(focusable[next]);
  };

  const activate = (i: number) => {
    const item = items[i];
    if (!isFocusable(item)) return;
    if (item.type === 'submenu') {
      setOpenSub({ index: i, focus: 'first' });
      return;
    }
    item.onSelect?.();
    if (!item.keepOpen) onCloseAll(true);
  };

  const typeahead = useRef({ text: '', at: 0 });
  const onKeyDown = (e: React.KeyboardEvent) => {
    // Keys from an open submenu bubble through React; let it handle its own.
    if (e.target !== e.currentTarget && !refs.current.includes(e.target as HTMLElement)) return;
    const active = activeRef.current;
    const item = items[active];
    switch (e.key) {
      case 'ArrowDown':
        step(1);
        break;
      case 'ArrowUp':
        step(-1);
        break;
      case 'Home':
        if (focusable.length) focusAt(focusable[0]);
        break;
      case 'End':
        if (focusable.length) focusAt(focusable[focusable.length - 1]);
        break;
      case 'Enter':
      case ' ':
        if (active >= 0) activate(active);
        break;
      case 'ArrowRight':
        if (item?.type === 'submenu' && !item.disabled) setOpenSub({ index: active, focus: 'first' });
        else return;
        break;
      case 'ArrowLeft':
        if (submenu) onDismiss();
        else return;
        break;
      case 'Escape':
        onDismiss();
        break;
      case 'Tab':
        onCloseAll(false);
        return; // let focus move on
      default: {
        if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
        // Type a letter (or a few, quickly) to jump to a matching item.
        // Pressing the same letter again cycles through items that start with it.
        const now = Date.now();
        const ch = e.key.toLowerCase();
        typeahead.current.text = now - typeahead.current.at > 600 ? ch : typeahead.current.text + ch;
        typeahead.current.at = now;
        const text = typeahead.current.text;
        const query = [...text].every((c) => c === text[0]) ? text[0] : text;
        // A longer prefix may still match the current item; a single letter moves on.
        const from = query.length > 1 ? active - 1 : active;
        const order = [...focusable.filter((i) => i > from), ...focusable.filter((i) => i <= from)];
        const match = order.find((i) => (items[i] as MenuAction).label.toLowerCase().startsWith(query));
        if (match !== undefined) focusAt(match);
        break;
      }
    }
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      role="menu"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="min-w-[200px] max-w-[320px] p-1 rounded-pc-lg bg-secondary border border-line-strong shadow-2xl text-sm outline-none"
    >
      {items.map((item, i) => {
        if (item.type === 'separator') return <div key={i} role="separator" className="my-1 h-px bg-line" />;
        if (item.type === 'label')
          return (
            <div key={i} role="presentation" className="px-2.5 pt-2 pb-1 text-[10px] uppercase tracking-wider text-subtle">
              {item.label}
            </div>
          );

        const isSub = item.type === 'submenu';
        const action = item as MenuAction;
        const checkable = !isSub && action.checked !== undefined;
        const role = isSub ? 'menuitem' : checkable ? (action.radio ? 'menuitemradio' : 'menuitemcheckbox') : 'menuitem';
        const subOpen = openSub?.index === i;

        return (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role={role}
            tabIndex={active === i ? 0 : -1}
            aria-disabled={item.disabled || undefined}
            aria-checked={checkable ? action.checked : undefined}
            aria-haspopup={isSub ? 'menu' : undefined}
            aria-expanded={isSub ? subOpen : undefined}
            onClick={() => activate(i)}
            onPointerEnter={() => {
              if (item.disabled) return;
              focusAt(i);
              setOpenSub(isSub ? { index: i, focus: 'none' } : null);
            }}
            className={`relative flex items-center gap-2 h-8 px-2.5 rounded-pc-sm cursor-default select-none outline-none ${
              item.disabled
                ? 'opacity-40'
                : `${action.danger ? 'text-danger focus:bg-[color-mix(in_srgb,var(--pc-danger)_18%,transparent)]' : 'focus:bg-tertiary'} ${subOpen ? 'bg-tertiary' : ''}`
            }`}
          >
            <span aria-hidden className="w-4 shrink-0 grid place-items-center text-xs text-secondary">
              {item.icon ?? (checkable && action.checked && <FontAwesomeIcon icon={faCheck} />)}
            </span>
            <span className="flex-1 truncate">{item.label}</span>
            {!isSub && action.shortcut && <span className="text-xs text-subtle font-mono">{action.shortcut}</span>}
            {/* With an icon in the left slot, the check moves to the right. */}
            {checkable && item.icon && action.checked && <FontAwesomeIcon icon={faCheck} className="text-xs text-secondary" aria-hidden />}
            {isSub && <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-secondary" aria-hidden />}
            {isSub && subOpen && (
              <Popover
                open
                portal={false}
                anchor={refs.current[i]}
                placement="right-start"
                onClose={() => setOpenSub(null)}
                // Clicks inside the submenu must not reach this item's onClick.
                onClick={(e) => e.stopPropagation()}
                onPointerEnter={(e) => e.stopPropagation()}
              >
                {openSub.focus === 'none' ? (
                  <HoverSubmenu
                    items={item.items}
                    label={item.label}
                    onDismiss={() => {
                      setOpenSub(null);
                      focusAt(i);
                    }}
                    onCloseAll={onCloseAll}
                  />
                ) : (
                  <MenuList
                    items={item.items}
                    label={item.label}
                    initialFocus={openSub.focus}
                    submenu
                    onDismiss={() => {
                      setOpenSub(null);
                      focusAt(i);
                    }}
                    onCloseAll={onCloseAll}
                  />
                )}
              </Popover>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * A submenu opened by hovering: it shows without stealing focus, and takes
 * focus as soon as the pointer moves into it.
 */
const HoverSubmenu: React.FC<Omit<ListProps, 'initialFocus' | 'submenu'>> = (props) => {
  const [engaged, setEngaged] = useState(false);
  if (engaged) return <MenuList {...props} initialFocus="first" submenu />;
  return (
    <div onPointerMove={() => setEngaged(true)} className="pointer-events-auto">
      <div className="pointer-events-none">
        <MenuList {...props} initialFocus="first" submenu key="preview" />
      </div>
    </div>
  );
};

// ----------------------------------------------------------------- Menu

type MenuProps = {
  items: MenuItem[];
  /** Accessible name for the trigger and the menu, e.g. "Track options". */
  label: string;
  /** Trigger content. Defaults to a "⋯" icon. */
  trigger?: React.ReactNode;
  placement?: Exclude<PopoverPlacement, 'right-start'>;
  triggerClassName?: string;
};

/** A button that opens a dropdown menu. */
const Menu: React.FC<MenuProps> = ({ items, label, trigger, placement = 'bottom-start', triggerClassName }) => {
  const button = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<null | 'first' | 'last'>(null);
  const menuId = useId();

  const close = (refocus: boolean) => {
    setOpen(null);
    if (refocus) button.current?.focus();
  };

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-label={trigger ? undefined : label}
        aria-haspopup="menu"
        aria-expanded={open !== null}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => (o ? null : 'first'))}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(e.key === 'ArrowDown' ? 'first' : 'last');
          }
        }}
        className={
          triggerClassName ??
          `inline-flex items-center justify-center gap-2 h-8 min-w-8 px-2 rounded-pc-md text-sm transition-colors duration-fast outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            open ? 'bg-surface-3' : 'bg-tertiary hover:bg-surface-3'
          }`
        }
      >
        {trigger ?? <FontAwesomeIcon icon={faEllipsis} />}
      </button>
      <Popover id={menuId} open={open !== null} anchor={button.current} placement={placement} onClose={(why) => close(why === 'escape')}>
        {open && <MenuList items={items} label={label} initialFocus={open} onDismiss={() => close(true)} onCloseAll={close} />}
      </Popover>
    </>
  );
};

// ----------------------------------------------------------------- ContextMenu

type ContextMenuProps = {
  /** Items, or a function so they can depend on what was right-clicked. */
  items: MenuItem[] | (() => MenuItem[]);
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
};

/**
 * Opens a menu on right-click, or on Shift+F10 / the Menu key when something
 * inside has focus. The wrapper has `display: contents`, so it does not
 * affect layout.
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({ items, label, children, disabled }) => {
  const [at, setAt] = useState<PopoverAnchor>(null);
  const [list, setList] = useState<MenuItem[]>([]);
  const returnTo = useRef<HTMLElement | null>(null);

  const openAt = (anchor: PopoverAnchor) => {
    returnTo.current = document.activeElement as HTMLElement | null;
    setList(typeof items === 'function' ? items() : items);
    setAt(anchor);
  };
  const close = (refocus: boolean) => {
    setAt(null);
    if (refocus) returnTo.current?.focus();
  };

  return (
    <div
      className="contents"
      onContextMenu={(e) => {
        if (disabled) return;
        e.preventDefault();
        openAt({ x: e.clientX, y: e.clientY });
      }}
      onKeyDown={(e) => {
        if (disabled || at) return;
        if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
          e.preventDefault();
          const r = (e.target as HTMLElement).getBoundingClientRect();
          openAt({ x: r.left + 8, y: r.bottom });
        }
      }}
    >
      {children}
      <Popover open={at !== null} anchor={at} onClose={(why) => close(why === 'escape')}>
        {at && <MenuList items={list} label={label} initialFocus="first" onDismiss={() => close(true)} onCloseAll={close} />}
      </Popover>
    </div>
  );
};

export default Menu;
