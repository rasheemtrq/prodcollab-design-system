'use client';

import React, { useRef, useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import { CollabCursor, PresenceStack, type Collaborator } from '@/app/design-system/components/daw/Presence';
import source from '@/app/design-system/components/daw/Presence.tsx?raw';
import { useDemoClock } from '@/app/page-components/demo/useDemoClock';

const people: Collaborator[] = [
  { name: 'Kai', color: 1, activity: 'Editing Drums' },
  { name: 'Maya', color: 2, activity: 'In the mixer' },
  { name: 'Theo', color: 3, src: '/images/logo-256.png', activity: 'Listening' },
  { name: 'Jun', color: 4, status: 'idle' },
  { name: 'Ade', color: 5 },
  { name: 'Sol', color: 6 },
];

export default function PresencePage() {
  const { t } = useDemoClock(true);
  const box = useRef<HTMLDivElement>(null);
  const [me, setMe] = useState<{ x: number; y: number } | null>(null);
  // Fake network updates: positions change ~12 times a second, the cursor eases between them.
  const q = Math.floor(t * 12) / 12;
  const kai = { x: 180 + Math.cos(q * 0.9) * 140, y: 90 + Math.sin(q * 1.7) * 50 };
  const maya = { x: 420 + Math.sin(q * 0.6) * 90, y: 110 + Math.cos(q * 1.1) * 40 };

  return (
    <div>
      <Header01 />
      <DocExample
        name="Presence"
        source={source}
        stageClassName="flex-col"
        usage={`<PresenceStack people={[{ name: 'Kai', color: 1, activity: 'Editing Drums' }, ...]} max={4} />

<div className="relative">
  {peers.map((p) => <CollabCursor key={p.id} name={p.name} color={p.color} x={p.x} y={p.y} />)}
</div>`}
      >
        <div className="flex items-center gap-8">
          <PresenceStack people={people} />
          <PresenceStack people={people.slice(0, 3)} size="sm" />
        </div>
        <div
          ref={box}
          onPointerMove={(e) => {
            const r = box.current!.getBoundingClientRect();
            setMe({ x: e.clientX - r.left, y: e.clientY - r.top });
          }}
          onPointerLeave={() => setMe(null)}
          className="relative w-full max-w-[600px] h-[220px] rounded-2xl border border-dashed border-line-strong overflow-hidden cursor-none"
        >
          <span className="absolute bottom-3 left-4 text-xs text-subtle">Move your pointer here</span>
          <CollabCursor name="Kai" color={1} {...kai} />
          <CollabCursor name="Maya" color={2} {...maya} />
          {me && <CollabCursor name="You" color="var(--pc-accent)" {...me} />}
        </div>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'PresenceStack people', type: 'Collaborator[]', description: '{ name, color: PeerColor, src?, status?, activity? } in join order.' },
          { name: 'PresenceStack max', type: 'number', default: '4', description: 'Avatars before "+N".' },
          { name: 'PresenceStack size', type: "'sm' | 'md'", default: "'md'", description: '24 or 32 px.' },
          { name: 'CollabCursor name / color', type: 'string / PeerColor', description: 'Label and fill. Peer swatches 1–6 come from tokens.' },
          { name: 'CollabCursor x / y', type: 'number', description: 'Pixels inside the nearest positioned ancestor.' },
        ]}
      />
    </div>
  );
}
