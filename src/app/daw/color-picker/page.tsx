'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import ColorPicker, { ColorPickerButton, colorMenuItems, trackColorName } from '@/app/design-system/components/daw/ColorPicker';
import source from '@/app/design-system/components/daw/ColorPicker.tsx?raw';
import Menu from '@/app/design-system/components/Menu';
import type { TrackSwatch } from '@/app/design-system/components/daw/color';
import TrackHeader from '@/app/design-system/components/daw/TrackHeader';

export default function ColorPickerPage() {
  const [color, setColor] = useState<TrackSwatch>(3);
  return (
    <div>
      <Header01 />
      <DocExample
        name="ColorPicker"
        source={source}
        stageClassName="flex-col"
        usage={`<ColorPicker value={color} onChange={setColor} />
<ColorPickerButton value={color} onChange={setColor} />
<Menu label="Track options" items={[
  { type: 'submenu', label: 'Color', items: colorMenuItems(color, setColor) },
]} />`}
      >
        <TrackHeader name="Lead Vox" kind="vocal" color={color} />
        <div className="flex flex-wrap items-center justify-center gap-8">
          <ColorPicker value={color} onChange={setColor} />
          <ColorPicker value={color} onChange={setColor} size="sm" columns={8} label="Track color (compact)" />
          <ColorPickerButton value={color} onChange={setColor} />
          <Menu label="Track options" items={[{ type: 'submenu', label: 'Color', items: colorMenuItems(color, setColor) }]} />
        </div>
        <p className="text-xs text-secondary font-mono">color = {color} ({trackColorName(color)})</p>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'value / onChange', type: 'TrackColor / (n: number) => void', description: 'The track swatch, 1–8.' },
          { name: 'label', type: 'string', default: "'Track color'", description: 'Accessible name of the group.' },
          { name: 'columns', type: 'number', default: '4', description: 'Swatches per row. Up and down move by a row.' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '20 or 28 px swatches.' },
        ]}
      />
      <p className="text-sm text-secondary font-light">
        Also exported: <code>ColorPickerButton</code>, which takes the same props. A click closes its popover; with the keyboard, arrows browse and
        Enter or Escape closes. <code>colorMenuItems(value, onChange)</code> gives the radio items for a Color submenu.{' '}
        <code>TRACK_COLORS</code>, <code>TRACK_COLOR_NAMES</code> and <code>trackColorName()</code> are exported too.
      </p>
    </div>
  );
}
