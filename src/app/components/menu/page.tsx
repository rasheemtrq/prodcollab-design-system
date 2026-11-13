'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faPen, faTrash, faArrowUp, faArrowDown, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Menu, { ContextMenu, type MenuItem } from '@/app/design-system/components/Menu';
import source from '@/app/design-system/components/Menu.tsx?raw';
import { colorMenuItems, trackColorName } from '@/app/design-system/components/daw/ColorPicker';
import { trackColor, type TrackSwatch } from '@/app/design-system/components/daw/color';

export default function MenuPage() {
  const [last, setLast] = useState('Nothing yet');
  const [snap, setSnap] = useState(true);
  const [metronome, setMetronome] = useState(false);
  const [grid, setGrid] = useState('1/16');
  const [color, setColor] = useState<TrackSwatch>(3);
  const did = (what: string) => () => setLast(what);

  const fileItems: MenuItem[] = [
    { label: 'New project', shortcut: 'Ctrl+N', onSelect: did('New project') },
    { label: 'Open…', shortcut: 'Ctrl+O', onSelect: did('Open') },
    { type: 'submenu', label: 'Export', items: [
      { label: 'Mixdown (WAV)', onSelect: did('Export mixdown') },
      { label: 'Stems', onSelect: did('Export stems') },
      { label: 'MIDI', onSelect: did('Export MIDI') },
    ] },
    { type: 'separator' },
    { type: 'label', label: 'Options' },
    { label: 'Snap to grid', checked: snap, keepOpen: true, onSelect: () => setSnap((s) => !s) },
    { label: 'Metronome', checked: metronome, keepOpen: true, onSelect: () => setMetronome((s) => !s) },
    { type: 'submenu', label: 'Grid', items: ['1/4', '1/8', '1/16', '1/32'].map((g) => ({ label: g, radio: true, checked: grid === g, onSelect: () => setGrid(g) })) },
    { type: 'separator' },
    { label: 'Share settings', disabled: true },
  ];

  const trackItems: MenuItem[] = [
    { label: 'Rename', icon: <FontAwesomeIcon icon={faPen} />, shortcut: 'F2', onSelect: did('Rename track') },
    { label: 'Duplicate', icon: <FontAwesomeIcon icon={faCopy} />, shortcut: 'Ctrl+D', onSelect: did('Duplicate track') },
    { type: 'submenu', label: 'Color', icon: <span className="block w-3 h-3 rounded-full" style={{ background: trackColor(color) }} />, items: colorMenuItems(color, (c) => { setColor(c); setLast(`Color → ${trackColorName(c)}`); }) },
    { label: 'Move up', icon: <FontAwesomeIcon icon={faArrowUp} />, onSelect: did('Move up') },
    { label: 'Move down', icon: <FontAwesomeIcon icon={faArrowDown} />, onSelect: did('Move down') },
    { type: 'separator' },
    { label: 'Delete track', icon: <FontAwesomeIcon icon={faTrash} />, danger: true, shortcut: 'Del', onSelect: did('Delete track') },
  ];

  return (
    <div>
      <Header01 />
      <DocExample
        name="Menu"
        source={source}
        usage={`const items: MenuItem[] = [
  { label: 'Rename', shortcut: 'F2', onSelect: rename },
  { type: 'submenu', label: 'Color', items: colorMenuItems(color, setColor) },
  { label: 'Snap to grid', checked: snap, keepOpen: true, onSelect: toggleSnap },
  { type: 'separator' },
  { label: 'Delete track', danger: true, onSelect: remove },
];

<Menu label="Track options" items={items} />

<ContextMenu label="Track options" items={items}>
  <TrackHeader ... />
</ContextMenu>`}
      >
        <Menu
          label="File"
          items={fileItems}
          trigger={
            <>
              File <FontAwesomeIcon icon={faChevronDown} className="text-[10px] text-secondary" />
            </>
          }
        />
        <Menu label="Track options" items={trackItems} />
        <ContextMenu label="Track options" items={trackItems}>
          <div
            tabIndex={0}
            className="flex items-center gap-3 w-[260px] h-16 px-4 rounded-pc-md bg-secondary border border-dashed border-line-strong text-sm text-secondary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="w-1 self-stretch my-3 rounded-full" style={{ background: trackColor(color) }} />
            Right-click me (or focus and press Shift+F10)
          </div>
        </ContextMenu>
        <p className="basis-full text-center text-xs text-secondary font-mono">Last action: {last}</p>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'items', type: 'MenuItem[]', description: 'Actions, submenus, separators and labels. ContextMenu also accepts a function, called when it opens.' },
          { name: 'label', type: 'string', description: 'Accessible name of the menu (and of the trigger when it has no text).' },
          { name: 'trigger', type: 'ReactNode', default: '⋯ icon', description: 'Menu only: the button content.' },
          { name: 'placement', type: "'bottom-start' | 'bottom-end'", default: "'bottom-start'", description: 'Menu only. Flips up when there is no room below.' },
          { name: 'children', type: 'ReactNode', description: 'ContextMenu only: the area that opens it. Wrapped in display: contents.' },
        ]}
      />
      <PropsTable
        rows={[
          { name: 'label / onSelect', type: 'string / () => void', description: 'An action item.' },
          { name: 'shortcut', type: 'string', description: 'Shown on the right. Display only.' },
          { name: 'icon', type: 'ReactNode', description: 'Left slot. With checked, the check moves to the right.' },
          { name: 'checked / radio', type: 'boolean', description: 'Checkbox item, or radio item with radio: true.' },
          { name: 'keepOpen', type: 'boolean', description: 'Leave the menu open after choosing (toggles).' },
          { name: 'danger / disabled', type: 'boolean', description: 'Red destructive item / skipped by the keyboard.' },
          { name: "{ type: 'submenu', items }", type: 'MenuSubmenu', description: 'Opens on hover, click, Enter or Right.' },
          { name: "{ type: 'separator' | 'label' }", type: '—', description: 'A divider, or a small group heading.' },
        ]}
      />
    </div>
  );
}
