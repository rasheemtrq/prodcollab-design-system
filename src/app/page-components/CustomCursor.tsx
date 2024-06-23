'use client'

import React, { useEffect } from 'react';

interface CustomCursorProps {
  fill: string;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ fill }) => {
  const svgData = `
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M6.10494 7.13869L7.95153 18.2509C8.22089 19.8718 10.3849 20.2418 11.1775 18.8025L13.4697 14.6399L18.1372 13.746C19.751 13.437 20.0678 11.2646 18.6095 10.5075L8.61167 5.31745C7.34486 4.65982 5.87096 5.73067 6.10494 7.13869Z'
        fill='${fill}'
        stroke='white'
        strokeWidth='1.7321'
      />
    </svg>
  `;

  const svgBase64 = btoa(svgData);

  useEffect(() => {
    // Set custom cursor style on mount
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = `url("data:image/svg+xml;base64,${svgBase64}"), auto`;

    // Clean up: Reset cursor style on unmount
    return () => {
      document.body.style.cursor = originalCursor;
    };
  }, [svgBase64]);

  return null; // No need to render any component
};

export default CustomCursor;
