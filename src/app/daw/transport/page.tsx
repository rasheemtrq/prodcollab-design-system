'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Transport from '@/app/design-system/components/daw/Transport';
import source from '@/app/design-system/components/daw/Transport.tsx?raw';
import { useEffect, useRef } from 'react';
import { useDemoClock } from '@/app/page-components/demo/useDemoClock';

export default function TransportPage() {
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [looping, setLooping] = useState(true);
  const [metronome, setMetronome] = useState(false);
  const [bpm, setBpm] = useState(140);
  const { t, reset } = useDemoClock(playing);
  // Convert elapsed time to beats, keeping position continuous across tempo changes.
  const acc = useRef({ beats: 0, t: 0 });
  const beats = acc.current.beats + ((t - acc.current.t) * bpm) / 60;
  useEffect(() => {
    acc.current = { beats, t };
  }, [bpm]); // eslint-disable-line react-hooks/exhaustive-deps
  const position = looping ? beats % 16 : beats;

  return (
    <div>
      <Header01 />
      <DocExample
        name="Transport"
        source={source}
        usage={`<Transport
  playing={playing}
  onPlayToggle={() => setPlaying((p) => !p)}
  onStop={stop}
  position={beats}
  bpm={bpm}
  onBpmChange={setBpm}
  recording={recording}
  onRecordToggle={() => setRecording((r) => !r)}
  looping={looping}
  onLoopToggle={() => setLooping((l) => !l)}
/>`}
      >
        <Transport
          playing={playing}
          onPlayToggle={() => setPlaying((p) => !p)}
          onStop={() => {
            setPlaying(false);
            setRecording(false);
            reset();
            acc.current = { beats: 0, t: 0 };
          }}
          position={position}
          bpm={bpm}
          onBpmChange={setBpm}
          recording={recording}
          onRecordToggle={() => setRecording((r) => !r)}
          looping={looping}
          onLoopToggle={() => setLooping((l) => !l)}
          metronome={metronome}
          onMetronomeToggle={() => setMetronome((m) => !m)}
        />
      </DocExample>
      <PropsTable
        rows={[
          { name: 'playing / onPlayToggle', type: 'boolean / () => void', description: 'Play/pause state.' },
          { name: 'onStop', type: '() => void', description: 'Stop and return to the start.' },
          { name: 'position', type: 'number', description: 'Position in beats (quarter notes), 0-based. Shown as bar.beat.tick at 960 PPQ and as m:ss.mmm.' },
          { name: 'bpm / onBpmChange', type: 'number / (bpm) => void', description: 'Tempo; edited inline, clamped to 20–300, Enter commits and Escape cancels.' },
          { name: 'recording / onRecordToggle', type: 'boolean / () => void', description: 'Record button; shown only with a handler. The position readout turns red while recording.' },
          { name: 'looping / onLoopToggle', type: 'boolean / () => void', description: 'Loop button; shown only with a handler.' },
          { name: 'metronome / onMetronomeToggle', type: 'boolean / () => void', description: 'Click button; shown only with a handler.' },
          { name: 'beatsPerBar', type: 'number', default: '4', description: 'Time signature numerator.' },
        ]}
      />
      <p className="text-sm text-secondary font-light">
        Also exported: <code>Lcd</code> (the inset readout), <code>formatBbt</code>, <code>formatClock</code> and <code>PPQ</code>.
      </p>
    </div>
  );
}
