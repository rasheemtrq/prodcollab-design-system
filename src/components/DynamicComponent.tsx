// components/DynamicComponent.tsx
'use client'
// components/DynamicComponent.tsx

import React, { useEffect, useState } from 'react';

type ComponentName = 'Button' | 'InputField';

interface Props {
  componentName: ComponentName;
}

const componentCache: { [key in ComponentName]: React.ComponentType<any> | null } = {
  Button: null,
  InputField: null,
  // Add more components to cache here if needed
};

const preloadComponent = (componentName: ComponentName) => {
  if (!componentCache[componentName]) {
    import(`@/components/elements/${componentName}`).then(module => {
      console.log(`Component '${componentName}' preloaded`);
      componentCache[componentName] = module.default;
    }).catch(error => {
      console.error(`Error preloading component '${componentName}':`, error);
    });
  }
};

const DynamicComponent: React.FC<Props> = ({ componentName }) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    preloadComponent(componentName);
  }, [componentName]);

  useEffect(() => {
    if (componentCache[componentName]) {
      setComponent(componentCache[componentName]);
    } else {
      console.warn(`Component '${componentName}' not found in cache.`);
      setComponent(null); // Reset component if not loaded yet
    }
  }, [componentName]);

  if (!Component) {
    return null;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component />
    </React.Suspense>
  );
};

export default DynamicComponent;
