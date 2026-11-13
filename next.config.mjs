/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // `import source from './Button.tsx?raw'` returns the file as a string.
    // The docs pages use it so the code shown is always the real component.
    config.module.rules.push({ resourceQuery: /raw/, type: 'asset/source' });
    return config;
  },
};

export default nextConfig;
