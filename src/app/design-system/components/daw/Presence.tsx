import React from 'react';
import Image from 'next/image';
import { peerColor, type PeerColor } from './color';

export type Collaborator = {
  name: string;
  color: PeerColor;
  src?: string;
  /** Idle people are shown dimmed. */
  status?: 'active' | 'idle';
  /** What they are doing, e.g. "Editing Drums". Shown on hover. */
  activity?: string;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

type PresenceStackProps = {
  people: Collaborator[];
  /** Avatars shown before collapsing the rest into "+N". */
  max?: number;
  size?: 'sm' | 'md';
};

/** Who is in the session, in join order. */
export const PresenceStack: React.FC<PresenceStackProps> = ({ people, max = 4, size = 'md' }) => {
  const shown = people.slice(0, max);
  const hidden = people.slice(max);
  const px = size === 'sm' ? 24 : 32;
  const ring = 'ring-2 ring-[var(--pc-surface-0)]';

  return (
    <ul aria-label={`${people.length} ${people.length === 1 ? 'person' : 'people'} in this session`} className="flex items-center -space-x-2">
      {shown.map((p) => {
        const c = peerColor(p.color);
        const title = [p.name, p.status === 'idle' ? 'idle' : p.activity].filter(Boolean).join(' · ');
        return (
          <li
            key={p.name}
            title={title}
            aria-label={title}
            className={`relative rounded-full ${ring} ${p.status === 'idle' ? 'opacity-45' : ''}`}
            style={{ width: px, height: px, boxShadow: `0 0 0 2px ${c} inset` }}
          >
            {p.src ? (
              <Image src={p.src} alt="" width={px} height={px} className="rounded-full p-[3px] object-cover w-full h-full" />
            ) : (
              <span
                aria-hidden
                className="w-full h-full rounded-full grid place-items-center font-semibold text-inverse"
                style={{ background: c, fontSize: px * 0.36 }}
              >
                {initials(p.name)}
              </span>
            )}
          </li>
        );
      })}
      {hidden.length > 0 && (
        <li
          title={hidden.map((p) => p.name).join(', ')}
          aria-label={`and ${hidden.length} more: ${hidden.map((p) => p.name).join(', ')}`}
          className={`rounded-full bg-tertiary text-secondary grid place-items-center font-semibold ${ring}`}
          style={{ width: px, height: px, fontSize: px * 0.34 }}
        >
          +{hidden.length}
        </li>
      )}
    </ul>
  );
};

type CollabCursorProps = {
  name: string;
  color: PeerColor;
  /** Position in px inside the nearest positioned ancestor. */
  x: number;
  y: number;
};

/**
 * A collaborator's live pointer. Place it inside a `position: relative`
 * container that is the same coordinate space the positions are sent in.
 * It eases between updates so 10–20 Hz network updates still look smooth.
 */
export const CollabCursor: React.FC<CollabCursorProps> = ({ name, color, x, y }) => {
  const c = peerColor(color);
  return (
    <div
      aria-hidden
      className="absolute left-0 top-0 pointer-events-none z-20 transition-transform duration-fast ease-linear will-change-transform"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ fill: c }} stroke="#0a0a0b" strokeWidth="1.6">
        <path d="M6.1 7.14 7.95 18.25c.27 1.62 2.43 1.99 3.23.55l2.29-4.16 4.67-.9c1.61-.3 1.93-2.48.47-3.24L8.61 5.32c-1.27-.66-2.74.41-2.51 1.82Z" />
      </svg>
      <span
        className="absolute left-3.5 top-3.5 px-[7px] py-px rounded-full text-[11px] font-semibold whitespace-nowrap text-inverse"
        style={{ background: c }}
      >
        {name}
      </span>
    </div>
  );
};
