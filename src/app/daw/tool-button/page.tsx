'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import ToolButton from '@/app/design-system/components/daw/ToolButton';
import source from '@/app/design-system/components/daw/ToolButton.tsx?raw';

export default function ToolButtonPage() {
  const [on, setOn] = useState<Record<string, boolean>>({ mute: true, solo: false, record: true, accent: false, neutral: false });
  const flip = (k: string) => setOn((s) => ({ ...s, [k]: !s[k] }));
  return (
    <div>
      <Header01 />
      <DocExample
        name="ToolButton"
        source={source}
        stageClassName="flex-col"
        usage={`<ToolButton tone="mute" pressed={muted} onClick={toggleMute} label="Mute Drums" size="xs">M</ToolButton>
<ToolButton tone="record" pressed={armed} onClick={toggleArm} label="Arm Vox">R</ToolButton>
<ToolButton size="md" onClick={bounce}>Bounce</ToolButton>`}
      >
        <div className="flex gap-2 items-center">
          {(['mute', 'solo', 'record', 'accent', 'neutral'] as const).map((tone) => (
            <ToolButton key={tone} tone={tone} pressed={on[tone]} onClick={() => flip(tone)} size="md">
              {tone}
            </ToolButton>
          ))}
        </div>
        <div className="flex gap-1 items-center">
          <ToolButton size="xs" tone="mute" pressed={on.mute} onClick={() => flip('mute')} label="Mute">M</ToolButton>
          <ToolButton size="xs" tone="solo" pressed={on.solo} onClick={() => flip('solo')} label="Solo">S</ToolButton>
          <ToolButton size="xs" tone="record" pressed={on.record} onClick={() => flip('record')} label="Record arm">R</ToolButton>
          <span className="w-4" />
          <ToolButton size="sm">Quantize</ToolButton>
          <ToolButton size="sm" disabled>Disabled</ToolButton>
        </div>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'children', type: 'ReactNode', description: 'Text or icon.' },
          { name: 'pressed', type: 'boolean', description: 'Latched state, announced via aria-pressed. Leave undefined for a momentary button.' },
          { name: 'tone', type: "'neutral' | 'accent' | 'mute' | 'solo' | 'record'", default: "'accent'", description: 'Color when pressed.' },
          { name: 'size', type: "'xs' | 'sm' | 'md'", default: "'sm'", description: '20, 24 or 28 px tall.' },
          { name: 'label', type: 'string', description: 'Accessible name and tooltip. Required for single letters or icons.' },
          { name: '...rest', type: 'ButtonHTMLAttributes', description: 'onClick, disabled, and so on.' },
        ]}
      />
    </div>
  );
}
