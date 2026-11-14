'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import { ChannelStrip, PresenceStack, Transport, dbToGain, gainToDb, usePeakHold, type TrackColor } from '@/app/design-system/components/daw';
import { demoLevel, useDemoClock } from '@/app/page-components/demo/useDemoClock';

type Channel = {
  name: string;
  color: TrackColor;
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
  inserts: string[];
  seed: number;
  loudness: number;
};

const START: Channel[] = [
  { name: 'Kick', color: 4, volume: -2, pan: 0, muted: false, soloed: false, inserts: ['EQ Eight', 'Saturator'], seed: 0, loudness: -9 },
  { name: 'Snare', color: 6, volume: -5, pan: 0.05, muted: false, soloed: false, inserts: ['EQ Eight', 'Glue Comp'], seed: 1, loudness: -12 },
  { name: 'Hats', color: 8, volume: -10, pan: 0.3, muted: false, soloed: false, inserts: ['EQ Eight'], seed: 3, loudness: -16 },
  { name: 'Reese Bass', color: 2, volume: -4, pan: 0, muted: false, soloed: false, inserts: ['OTT', 'Saturator', 'Utility'], seed: 2, loudness: -11 },
  { name: 'Chords', color: 1, volume: -8, pan: -0.25, muted: false, soloed: false, inserts: ['Chorus', 'Plate'], seed: 5, loudness: -15 },
  { name: 'Lead Vox', color: 3, volume: -3, pan: 0, muted: false, soloed: false, inserts: ['Pitch Fix', 'De-esser', 'Comp', 'Delay'], seed: 4, loudness: -12 },
  { name: 'FX', color: 7, volume: -14, pan: -0.5, muted: true, soloed: false, inserts: ['Reverb'], seed: 7, loudness: -18 },
];

// Equal-power pan law: -3 dB at center, 0 dB fully to one side.
const panGains = (pan: number) => {
  const a = ((pan + 1) * Math.PI) / 4;
  return [Math.cos(a) * Math.SQRT2, Math.sin(a) * Math.SQRT2];
};

export default function MixerPattern() {
  const [channels, setChannels] = useState(START);
  const [master, setMaster] = useState(0);
  const [selected, setSelected] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(140);
  const { t, reset } = useDemoClock(playing);

  const update = (i: number, patch: Partial<Channel>) => setChannels((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const anySolo = channels.some((c) => c.soloed);

  // Per-channel post-fader levels, then a power sum into the master bus.
  const levels = channels.map((c) => {
    const audible = playing && !c.muted && (!anySolo || c.soloed);
    if (!audible) return [-Infinity, -Infinity];
    const pre = demoLevel(t, bpm, c.seed, c.loudness) + c.volume;
    const [l, r] = panGains(c.pan);
    return [pre + gainToDb(l), pre + gainToDb(r)];
  });
  const masterLevels = [0, 1].map((ch) => {
    const power = levels.reduce((sum, lv) => sum + dbToGain(lv[ch]) ** 2, 0);
    return gainToDb(Math.sqrt(power)) + master;
  });

  // One hook call for every meter channel keeps the hook order stable.
  const allPeaks = usePeakHold([...levels.flat(), ...masterLevels]);

  return (
    <div>
      <Header01 />
      <div className="flex flex-col gap-3 p-4 rounded-[2rem] bg-primary border border-secondary">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Transport
            playing={playing}
            onPlayToggle={() => setPlaying((p) => !p)}
            onStop={() => {
              setPlaying(false);
              reset();
            }}
            position={(t * bpm) / 60}
            bpm={bpm}
            onBpmChange={setBpm}
          />
          <PresenceStack
            people={[
              { name: 'Kai', color: 1, activity: 'Mixing vocals' },
              { name: 'Maya', color: 2, activity: 'Arranging' },
              { name: 'Theo', color: 3, status: 'idle' },
            ]}
          />
        </div>
        <div className="flex gap-1 items-start overflow-x-auto pb-2">
          {channels.map((c, i) => (
            <ChannelStrip
              key={c.name}
              name={c.name}
              color={c.color}
              volume={c.volume}
              onVolumeChange={(volume) => update(i, { volume })}
              pan={c.pan}
              onPanChange={(pan) => update(i, { pan })}
              muted={c.muted}
              soloed={c.soloed}
              onMute={() => update(i, { muted: !c.muted })}
              onSolo={() => update(i, { soloed: !c.soloed })}
              dimmed={anySolo && !c.soloed}
              levels={levels[i]}
              peaks={allPeaks.slice(i * 2, i * 2 + 2)}
              inserts={c.inserts}
              selected={selected === i}
              onSelect={() => setSelected(i)}
            />
          ))}
          <div aria-hidden className="self-stretch w-px mx-1.5 my-3 shrink-0 bg-line" />
          <ChannelStrip
            name="Master"
            master
            volume={master}
            onVolumeChange={setMaster}
            levels={masterLevels}
            peaks={allPeaks.slice(-2)}
            inserts={['Glue Comp', 'Limiter']}
          />
        </div>
      </div>
      <p className="text-sm text-secondary font-light mt-4 max-w-[44rem]">
        Built from <code>Transport</code>, <code>ChannelStrip</code> (a meter-in-fader on the <code>Fader</code> law, a pan slider and
        mute/solo, all on the shared drag and keyboard gestures), <code>PresenceStack</code> and <code>usePeakHold</code>. Channels use
        equal-power panning and sum into the master bus by power, so the meters behave the way you would expect, but the signal is
        simulated.
      </p>
    </div>
  );
}
