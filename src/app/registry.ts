// Every documented page, in nav order. The sidebar and page headers read from
// this list, so adding a page means adding one entry here.

export type DocGroup = 'Foundations' | 'Components' | 'DAW Controls' | 'Patterns';

export type DocEntry = {
  href: string;
  name: string;
  group: DocGroup;
  description: string;
  isNew?: boolean;
};

export const docs: DocEntry[] = [
  // Foundations
  {
    href: '/colors',
    name: 'Colors',
    group: 'Foundations',
    description:
      'Surfaces, text, status, DAW signal, track and collaborator colors. Every value is a CSS variable in src/app/styles/tokens.css, and Tailwind classes such as bg-surface-2 or bg-track-3 resolve to the same variables.',
  },
  {
    href: '/tokens',
    name: 'Tokens',
    group: 'Foundations',
    description:
      'Radius, motion, and type tokens. The DAW is plain CSS, so it can import tokens.css directly and share these values without Tailwind.',
    isNew: true,
  },

  // General components
  {
    href: '/components/accordion',
    name: 'Accordion',
    group: 'Components',
    description:
      'A collapsible content container for FAQs and segmented content. Several rows can be open at once, and each header is a button that reports its expanded state.',
  },
  {
    href: '/components/alert',
    name: 'Alert',
    group: 'Components',
    description:
      'Conveys an important message with default, success, warning, and error variants. Each variant has its own icon and border so the meaning does not rely on color alone.',
  },
  {
    href: '/components/avatar',
    name: 'Avatar',
    group: 'Components',
    description:
      'Displays a user image in circle, rounded, or square shapes, at three sizes. For people in a live session, use Presence instead.',
  },
  {
    href: '/components/badge',
    name: 'Badge',
    group: 'Components',
    description:
      'A small status marker: a dot, or a count that caps at 99+. Pin it to the corner of another element with the anchored layout.',
    isNew: true,
  },
  {
    href: '/components/button',
    name: 'Button',
    group: 'Components',
    description:
      'The main action control, with default, primary, secondary, and error variants at three sizes. It forwards native button props, so type, disabled and aria attributes work as usual.',
  },
  {
    href: '/components/card',
    name: 'Card',
    group: 'Components',
    description:
      'A container for a short piece of content with an avatar, such as a project, a comment or a collaborator.',
  },
  {
    href: '/components/chip',
    name: 'Chip',
    group: 'Components',
    description:
      'Small blocks of information such as tags, genres or categories. Ideal for filtering, selection, or labeling content.',
  },
  {
    href: '/components/input-field',
    name: 'Input Field',
    group: 'Components',
    description:
      'A text input with default, outlined, password, and error states. Required fields show an asterisk, and errors are linked to the input for screen readers.',
  },
  {
    href: '/components/menu',
    name: 'Menu',
    group: 'Components',
    description:
      'A dropdown menu, and a context menu that opens on right-click (or Shift+F10). Both support submenus, checkbox and radio items, shortcuts, and destructive items. Keyboard: arrows move, Enter chooses, Right opens a submenu, Escape steps back, and typing a letter jumps to an item.',
    isNew: true,
  },
  {
    href: '/components/modal',
    name: 'Modal',
    group: 'Components',
    description:
      'A dialog over the page. It closes on Escape or a backdrop click, moves focus into itself on open, and gives focus back when it closes.',
    isNew: true,
  },
  {
    href: '/components/skeleton',
    name: 'Skeleton',
    group: 'Components',
    description:
      'A placeholder shown while content loads. It mimics the shape of the content to reduce perceived waiting time.',
  },
  {
    href: '/components/tablist',
    name: 'Tablist',
    group: 'Components',
    description:
      'A segmented row of tabs at four sizes. It works controlled or uncontrolled, and arrow keys move between tabs.',
  },
  {
    href: '/components/toggle',
    name: 'Toggle',
    group: 'Components',
    description:
      'An on/off switch at three sizes. It is a real button with role="switch", so it works from the keyboard and reports its state.',
  },
  {
    href: '/components/tooltip',
    name: 'Tooltip',
    group: 'Components',
    description:
      'Shows a short hint when the trigger is hovered or focused, after a short delay so it does not flash while the pointer passes over.',
  },

  // DAW controls
  {
    href: '/daw/knob',
    name: 'Knob',
    group: 'DAW Controls',
    description:
      'A rotary control for parameters such as pan, sends, cutoff, or drive. Drag up or down to change it, hold Shift for fine moves, scroll, use the arrow keys, or double-click to reset.',
    isNew: true,
  },
  {
    href: '/daw/fader',
    name: 'Fader',
    group: 'DAW Controls',
    description:
      'A vertical volume fader in decibels. Its curve gives more travel around 0 dB, where mixing happens. It uses the same gestures as Knob, and double-click resets it to 0 dB.',
    isNew: true,
  },
  {
    href: '/daw/meter',
    name: 'Meter',
    group: 'DAW Controls',
    description:
      'A level meter in dBFS. It is green below −12 dB, yellow up to −3 dB, and red above, with an optional peak-hold line and a clip light. The usePeakHold hook supplies the peak line.',
    isNew: true,
  },
  {
    href: '/daw/tool-button',
    name: 'Tool Button',
    group: 'DAW Controls',
    description:
      'The compact toggle used for mute, solo, record arm, loop and metronome. Each tone has its own pressed color, and the pressed state is announced with aria-pressed.',
    isNew: true,
  },
  {
    href: '/daw/transport',
    name: 'Transport',
    group: 'DAW Controls',
    description:
      'Play, stop, record, loop and metronome controls, with a position readout (bars.beats.ticks, 960 PPQ, the same resolution as the DAW engine) and an editable tempo.',
    isNew: true,
  },
  {
    href: '/daw/track-header',
    name: 'Track Header',
    group: 'DAW Controls',
    description:
      'The left edge of an arrangement row: track color, type, name, mute, solo, record arm, and a level meter.',
    isNew: true,
  },
  {
    href: '/daw/clip',
    name: 'Clip',
    group: 'DAW Controls',
    description:
      'A region on the timeline. Audio clips draw a waveform from peak data, and MIDI clips draw their notes. Clips take the track color and can show which collaborator is working on them.',
    isNew: true,
  },
  {
    href: '/daw/step-sequencer',
    name: 'Step Sequencer',
    group: 'DAW Controls',
    description:
      'A drum pattern grid. Beats are shaded so the bar is easy to read, the current step is highlighted during playback, and the arrow keys move focus around the grid.',
    isNew: true,
  },
  {
    href: '/daw/color-picker',
    name: 'Color Picker',
    group: 'DAW Controls',
    description:
      'Picks one of the eight track colors. It comes three ways: inline as a radio group, as a swatch button with a popover, or as radio items for a Color submenu in a track menu.',
    isNew: true,
  },
  {
    href: '/daw/piano-roll',
    name: 'Piano Roll',
    group: 'DAW Controls',
    description:
      'The MIDI note editor: a keyboard, a snap grid, a velocity lane and the playhead. Click to place a note and drag to slide it into place. Drag the right edge to resize, Shift-drag to box-select, and double-click to delete. Everything also works from the keyboard.',
    isNew: true,
  },
  {
    href: '/daw/automation-lane',
    name: 'Automation Lane',
    group: 'DAW Controls',
    description:
      'Breakpoint automation for one parameter, drawn in song time under a track. The line is flat before the first point and after the last, with straight lines in between, the same rule the DAW engine uses. valueAt() returns the value at any time.',
    isNew: true,
  },
  {
    href: '/daw/channel-strip',
    name: 'Channel Strip',
    group: 'DAW Controls',
    description:
      'One mixer channel: name, peak readout, a fader whose track is the stereo meter, pan, mute and solo, and an insert list behind an FX button. The fader uses the Fader law and every control shares the Knob and Fader gestures.',
    isNew: true,
  },
  {
    href: '/daw/presence',
    name: 'Presence',
    group: 'DAW Controls',
    description:
      'Shows who is in the session: an avatar stack with collaborator colors and an idle state, plus the labeled live cursor drawn over the workspace.',
    isNew: true,
  },

  // Patterns
  {
    href: '/patterns/mixer',
    name: 'Mixer',
    group: 'Patterns',
    description:
      'Channel strips, a master bus and the transport working together. Press play: the meters respond to the faders, mutes and solos. The signal is simulated, not real audio.',
    isNew: true,
  },
  {
    href: '/patterns/arrangement',
    name: 'Arrangement',
    group: 'Patterns',
    description:
      'Track headers, clips, automation, a moving playhead and collaborator presence, laid out the way the DAW arranges a song. Select a MIDI clip to edit it in the piano roll, and right-click a track for its menu.',
    isNew: true,
  },
];

export const groups: DocGroup[] = ['Foundations', 'Components', 'DAW Controls', 'Patterns'];

export const findDoc = (href: string) => docs.find((d) => d.href === href);
