import type { Config } from "tailwindcss";

// Colors point at the CSS variables in src/app/styles/tokens.css so the
// design system and the DAW share one source of truth.
const v = (name: string) => `var(--pc-${name})`;

const track = Object.fromEntries(
  Array.from({ length: 8 }, (_, i) => [`${i + 1}`, v(`track-${i + 1}`)]),
);
const peer = Object.fromEntries(
  Array.from({ length: 6 }, (_, i) => [`${i + 1}`, v(`peer-${i + 1}`)]),
);

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Gantari is drawn a step lighter than Mundial, the font it replaced, so each
      // named weight sits one step heavier: Gantari 500 matches Mundial Regular.
      fontWeight: { light: '400', normal: '500', semibold: '700', bold: '800' },
      colors: {
        // Original names, kept so existing classes keep working.
        primary: v("surface-0"),
        secondary: v("surface-1"),
        tertiary: v("surface-2"),
        accent: { DEFAULT: v("accent"), hover: v("accent-hover"), ink: v("accent-ink") },

        surface: {
          0: v("surface-0"),
          1: v("surface-1"),
          2: v("surface-2"),
          3: v("surface-3"),
          inset: v("surface-inset"),
          inverse: v("surface-inverse"),
        },
        line: { DEFAULT: v("line"), strong: v("line-strong"), control: v("line-control") },
        success: v("success"),
        warning: v("warning"),
        danger: v("danger"),
        record: v("record"),
        mute: v("mute"),
        solo: v("solo"),
        playhead: v("playhead"),
        meter: { low: v("meter-low"), mid: v("meter-mid"), high: v("meter-high") },
        track,
        peer,
      },
      borderColor: {
        primary: v("surface-0"),
        secondary: v("surface-1"),
        tertiary: v("surface-2"),
      },
      textColor: {
        primary: v("text"),
        secondary: v("text-muted"),
        tertiary: v("surface-2"),
        muted: v("text-muted"),
        subtle: v("text-subtle"),
        inverse: v("text-inverse"),
        error: v("danger"),
      },
      borderRadius: {
        xs: v("radius-xs"),
        "pc-sm": v("radius-sm"),
        "pc-md": v("radius-md"),
        "pc-lg": v("radius-lg"),
        "pc-xl": v("radius-xl"),
      },
      fontFamily: {
        sans: [v("font-sans")],
        mono: [v("font-mono")],
      },
      transitionDuration: {
        fast: v("duration-fast"),
        base: v("duration-base"),
        slow: v("duration-slow"),
      },
      transitionTimingFunction: {
        "pc-out": v("ease-out"),
      },
    },
  },
  plugins: [],
};
export default config;
