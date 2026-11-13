'use client';

import React from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Accordion from '@/app/design-system/components/Accordion';
import source from '@/app/design-system/components/Accordion.tsx?raw';

const items = [
  { title: 'What is ProdCollab?', content: 'ProdCollab is an online DAW for music producers and artists to collaborate in real time.' },
  { title: 'How can I use this design system?', content: 'Download or clone from the GitHub repo, and follow the README.md' },
  { title: 'When is the product releasing?', content: 'As soon as we get most of the product up and running!' },
];

export default function AccordionPage() {
  return (
    <div>
      <Header01 />
      <DocExample
        name="Accordion"
        source={source}
        usage={`const items = [
  { title: 'Heading 1', content: 'Description here.' },
  { title: 'Heading 2', content: 'Description here.' },
];

<Accordion items={items} numberOfRows={2} />`}
      >
        <Accordion items={items} numberOfRows={3} />
      </DocExample>
      <PropsTable
        rows={[
          { name: 'items', type: '{ title: string; content: ReactNode }[]', description: 'Rows to render.' },
          { name: 'numberOfRows', type: 'number', default: 'items.length', description: 'Render only the first N rows.' },
        ]}
      />
    </div>
  );
}
