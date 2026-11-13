'use client';

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import DocExample from '@/app/page-components/docs/DocExample';
import PropsTable from '@/app/page-components/docs/PropsTable';
import Modal from '@/app/design-system/components/Modal';
import source from '@/app/design-system/components/Modal.tsx?raw';
import Button from '@/app/design-system/components/Button';

export default function ModalPage() {
  const [open, setOpen] = useState<null | 'default' | 'primary'>(null);
  const close = () => setOpen(null);
  return (
    <div>
      <Header01 />
      <DocExample
        name="Modal"
        source={source}
        usage={`const [open, setOpen] = useState(false);

<Modal
  title="Delete track?"
  isOpen={open}
  onClose={() => setOpen(false)}
  actions={<Button label="Delete" variant="error" onClick={remove} />}
>
  This removes the track and its clips for everyone in the session.
</Modal>`}
      >
        <Button label="Open modal" variant="secondary" onClick={() => setOpen('default')} />
        <Button label="Open confirm" variant="primary" onClick={() => setOpen('primary')} />
        <Modal title="Invite collaborators" isOpen={open === 'default'} onClose={close}>
          Anyone with the link can join this session and edit the arrangement. You can change this later in Share settings.
        </Modal>
        <Modal
          title="Delete track?"
          variant="primary"
          isOpen={open === 'primary'}
          onClose={close}
          actions={
            <>
              <Button label="Cancel" variant="secondary" onClick={close} />
              <Button label="Delete" variant="error" onClick={close} />
            </>
          }
        >
          This removes &ldquo;Lead Vox&rdquo; and its clips for everyone in the session.
        </Modal>
      </DocExample>
      <PropsTable
        rows={[
          { name: 'title', type: 'string', description: 'Dialog heading, also its accessible name.' },
          { name: 'isOpen', type: 'boolean', description: 'Whether the dialog is shown.' },
          { name: 'onClose', type: '() => void', description: 'Called on Escape, a backdrop click, or the close button.' },
          { name: 'actions', type: 'ReactNode', default: 'Close button', description: 'Footer buttons.' },
          { name: 'variant', type: "'default' | 'primary' | 'secondary'", default: "'default'", description: 'Border and surface style.' },
        ]}
      />
    </div>
  );
}
