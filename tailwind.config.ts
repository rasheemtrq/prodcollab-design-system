import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A0B',
        secondary:'#181819',
        tertiary: '#28292B',
        accent: '#3c82f6',
      },
      borderColor: {
        primary: '#0A0A0B',
        secondary: '#181819',
        tertiary: '#28292B',
        accent: '#3c82f6',
      },
      textColor: {
        primary: '#FFFFFF',
        secondary: '#9c9d9f',
        tertiary: '#28292B',
        error: '#ED5461',
      }
    },
  },
  plugins: [],
};
export default config;