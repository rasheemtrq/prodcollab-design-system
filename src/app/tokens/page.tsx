import Header01 from '../page-components/body/Header01';
import { CodeBlock } from '../page-components/docs/DocExample';

const radii = [
  ['radius-xs', '2px', 'Meters'],
  ['radius-sm', '6px', 'Clips, fader track'],
  ['radius-md', '8px', 'Channel strips, track headers, play button'],
  ['radius-lg', '12px', 'Cards, alerts, panels'],
  ['radius-xl', '32px', 'Docs stages'],
  ['radius-full', '9999px', 'Buttons, chips, avatars'],
];

const motion = [
  ['duration-fast', '90ms', 'Hover, pressed, cursor easing'],
  ['duration-base', '200ms', 'Toggles, tooltips, panels'],
  ['duration-slow', '320ms', 'Larger layout changes'],
  ['ease-out', 'cubic-bezier(0.22, 1, 0.36, 1)', 'Default easing'],
];

const Row = ({ cells }: { cells: React.ReactNode[] }) => (
  <tr className="border-t border-secondary">
    {cells.map((c, i) => (
      <td key={i} className={`px-4 py-3 ${i < 2 ? 'font-mono text-xs' : 'text-secondary font-light text-sm'}`}>
        {c}
      </td>
    ))}
  </tr>
);

export default function TokensPage() {
  return (
    <div>
      <Header01 />

      <section className="mb-12">
        <h2 className="text-xl tracking-tight mb-4">Radius</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          {radii.map(([t, v]) => (
            <div key={t} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-tertiary border border-line-strong" style={{ borderRadius: `var(--pc-${t})` }} />
              <span className="text-xs font-mono text-secondary">{v}</span>
            </div>
          ))}
        </div>
        <table className="w-full text-left border border-secondary rounded-2xl overflow-hidden">
          <tbody>
            {radii.map(([t, v, use]) => (
              <Row key={t} cells={[`--pc-${t}`, v, use]} />
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-12">
        <h2 className="text-xl tracking-tight mb-4">Motion</h2>
        <table className="w-full text-left border border-secondary rounded-2xl overflow-hidden">
          <tbody>
            {motion.map(([t, v, use]) => (
              <Row key={t} cells={[`--pc-${t}`, v, use]} />
            ))}
          </tbody>
        </table>
        <p className="text-sm text-secondary font-light mt-3">
          Durations drop to 0 when the user has <code>prefers-reduced-motion</code> set. Meters and playheads are not transitions, so
          they keep moving.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl tracking-tight mb-4">Type</h2>
        <div className="flex flex-col gap-3 mb-4">
          <p className="text-[4rem] tracking-tight leading-none">Gantari</p>
          <p className="text-xl">A free variable font (SIL OFL): any weight from 100 to 900, with italics.</p>
          <p className="font-mono text-accent text-sm">5.3.480 · 0:09.043 · -6.0 dB · 140 BPM</p>
          <p className="text-[10px] uppercase tracking-wider text-secondary">Control label · 10px uppercase</p>
        </div>
        <table className="w-full text-left border border-secondary rounded-2xl overflow-hidden">
          <tbody>
            <Row cells={['--pc-font-sans', 'Gantari', 'All UI text']} />
            <Row cells={['--pc-font-mono', 'ui-monospace stack', 'Readouts: position, tempo, dB. Use tabular-nums so digits do not jitter.']} />
          </tbody>
        </table>
      </section>

      <section className="mb-12">
        <h2 className="text-xl tracking-tight mb-4">Using tokens</h2>
        <p className="text-sm text-secondary font-light mb-4 max-w-[44rem]">
          In this repo, use the Tailwind names. In the DAW or any plain-CSS app, import <code>tokens.css</code> and read the variables
          directly.
        </p>
        <CodeBlock
          code={`// Tailwind (this repo)
<div className="bg-surface-1 border-line text-muted rounded-pc-md" />
<div className="bg-track-3" />               // a track swatch
<span className="text-accent font-mono" />  // an LCD readout

/* Plain CSS (the DAW) */
@import "prodcollab-design-system/src/app/styles/tokens.css";
.strip { background: var(--pc-surface-1); border-top: 3px solid var(--pc-track-2); }
.clip  { background: color-mix(in srgb, var(--c) 26%, #0d0d0e); }`}
        />
      </section>
    </div>
  );
}
