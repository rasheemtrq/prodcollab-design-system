# ProdCollab Design System

ProdCollab is an online DAW for music producers to collaborate and share their tracks. This design system holds the tokens and components the DAW is built from, plus a docs site that shows each one working.

Live: https://prodcollab-design-system.vercel.app

## Run it

1. Install dependencies (Node 26, as on Vercel; Node 24 also works locally)
```
npm install
```
2. Start the dev server at http://localhost:3000
```
npm run dev
```
3. Unit tests for the editing logic
```
npm test
```

## What's inside

| Area | Where | Notes |
| --- | --- | --- |
| Tokens | `src/app/styles/tokens.css` | Every color, radius, duration and font as `--pc-*` variables. Tailwind reads them (`tailwind.config.ts`), and plain-CSS apps can import the file directly. |
| General components | `src/app/design-system/components/` | Accordion, Alert, Avatar, Badge, Button, Card, Chip, Input Field, Menu + ContextMenu, Modal, Popover, Skeleton, Tablist, Toggle, Tooltip. |
| DAW controls | `src/app/design-system/components/daw/` | Knob, Fader, Meter, Tool Button, Transport, Track Header, Clip, Step Sequencer, Color Picker, Piano Roll, Automation Lane, Channel Strip, Presence. Import from `daw/index.ts`. |
| Editing logic | `daw/editing.ts` | Pure functions (no React or DOM) behind the piano roll and automation lanes: note moves, resizing, quantize, duplicate, `valueAt` for automation. Tested in `tests/`. |
| Docs pages | `src/app/{components,daw,patterns}/` | One page per component. The nav and page headers come from `src/app/registry.ts`, and "Show code" loads the real component source via `?raw`. |

Conventions the DAW components share:

- Positions and lengths are in **beats** (quarter notes); the engine's 960 PPQ is used for the Transport readout.
- Controls are **controlled**: they take a value and report changes with `onChange`.
- `color` takes a track swatch number (1–8) or any CSS color; collaborators use peer swatches 1–6.
- Everything works from the keyboard, and each docs page lists the keys.
