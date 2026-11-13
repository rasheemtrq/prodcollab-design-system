// Swatches for every color token. Values mirror src/app/styles/tokens.css.

type Swatch = { name: string; token: string; value: string; dark?: boolean };

const groups: { title: string; note?: string; swatches: Swatch[] }[] = [
  {
    title: 'Surfaces',
    swatches: [
      { name: 'Background Low', token: 'surface-0', value: '#0A0A0B' },
      { name: 'Background Medium', token: 'surface-1', value: '#181819' },
      { name: 'Background High', token: 'surface-2', value: '#28292B' },
      { name: 'Hover', token: 'surface-3', value: '#3E3E40' },
      { name: 'Inset', token: 'surface-inset', value: '#050506' },
      { name: 'Background Alternate', token: 'surface-inverse', value: '#FFFFFF', dark: true },
    ],
  },
  {
    title: 'Text',
    swatches: [
      { name: 'Text', token: 'text', value: '#FFFFFF', dark: true },
      { name: 'Muted', token: 'text-muted', value: '#9C9D9F', dark: true },
      { name: 'Subtle', token: 'text-subtle', value: '#6B6C70' },
    ],
  },
  {
    title: 'Brand & status',
    swatches: [
      { name: 'Surface Brand', token: 'accent', value: '#3C82F6' },
      { name: 'Surface Success', token: 'success', value: '#00B857', dark: true },
      { name: 'Surface Warning', token: 'warning', value: '#FFCE29', dark: true },
      { name: 'Surface Error', token: 'danger', value: '#ED5461' },
    ],
  },
  {
    title: 'DAW signals',
    note: 'Mute, solo and record are the pressed colors of Tool Button. The meter zones are below −12 dBFS, −12 to −3, and above −3.',
    swatches: [
      { name: 'Record', token: 'record', value: '#ED5461' },
      { name: 'Mute', token: 'mute', value: '#FFCE29', dark: true },
      { name: 'Solo', token: 'solo', value: '#3C82F6' },
      { name: 'Playhead', token: 'playhead', value: '#FFFFFF', dark: true },
      { name: 'Meter Low', token: 'meter-low', value: '#00B857', dark: true },
      { name: 'Meter Mid', token: 'meter-mid', value: '#FFCE29', dark: true },
      { name: 'Meter High', token: 'meter-high', value: '#ED5461' },
    ],
  },
  {
    title: 'Track colors',
    note: 'The eight swatches a user can give a track. Clips, strips and headers derive their tints from one of these with color-mix(). Pass the number to any DAW component: color={3}.',
    swatches: [
      ['Blue', '#3C82F6'], ['Violet', '#8B5CF6'], ['Pink', '#EC4899'], ['Red', '#ED5461'],
      ['Orange', '#F59E0B'], ['Yellow', '#FFCE29'], ['Green', '#00B857'], ['Cyan', '#22D3EE'],
    ].map(([name, value], i) => ({ name: `${i + 1} · ${name}`, token: `track-${i + 1}`, value, dark: [5, 6, 7].includes(i) })),
  },
  {
    title: 'Collaborator colors',
    note: 'Given to people in a session in join order, for avatars, cursors and clip outlines. They are lighter than the track colors so a cursor stays visible over a clip.',
    swatches: ['#FF7AB6', '#4CC9F0', '#FFD166', '#B892FF', '#7BF1A8', '#FF9F68'].map((value, i) => ({
      name: `Peer ${i + 1}`,
      token: `peer-${i + 1}`,
      value,
      dark: true,
    })),
  },
];

export default function ColorGrid() {
  return (
    <div className="flex flex-col gap-12">
      {groups.map((g) => (
        <section key={g.title}>
          <h2 className="text-xl tracking-tight mb-1">{g.title}</h2>
          {g.note && <p className="text-sm text-secondary font-light mb-4 max-w-[44rem]">{g.note}</p>}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${g.note ? '' : 'mt-4'}`}>
            {g.swatches.map((s) => (
              <div
                key={s.token}
                className={`flex flex-col justify-between w-full h-[9rem] p-4 rounded-2xl border border-tertiary ${s.dark ? 'text-inverse' : 'text-primary'}`}
                style={{ background: `var(--pc-${s.token})` }}
              >
                <p>{s.name}</p>
                <div className="text-xs font-mono opacity-80">
                  <p>--pc-{s.token}</p>
                  <p>{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
