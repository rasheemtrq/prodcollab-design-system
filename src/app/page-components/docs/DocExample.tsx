'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const codeStyle = {
  ...atomDark,
  'code[class*="language-"]': { fontSize: '12px', lineHeight: '1.5', color: 'white' },
  'pre[class*="language-"]': {
    margin: 0,
    background: 'var(--pc-surface-inset)',
    borderRadius: '12px',
    maxHeight: '32rem',
    overflow: 'auto',
  },
};

type DocExampleProps = {
  /** Component name, used in the copy toast. */
  name: string;
  /** Full component source, usually imported with `?raw`. */
  source?: string;
  /** Short usage snippet shown under the preview. */
  usage?: string;
  /** Optional heading when a page has several examples. */
  title?: string;
  children: React.ReactNode;
  /** Classes for the preview stage, e.g. to change padding or alignment. */
  stageClassName?: string;
};

export const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <SyntaxHighlighter language="tsx" style={codeStyle}>
    {code.trim()}
  </SyntaxHighlighter>
);

const DocExample: React.FC<DocExampleProps> = ({ name, source, usage, title, children, stageClassName }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <section className="flex flex-col gap-4 mb-12">
      {title && <h2 className="text-xl tracking-tight">{title}</h2>}

      <div className="relative bg-primary border border-secondary rounded-[2rem] overflow-hidden">
        {source && (
          <div className="absolute top-0 inset-x-0 flex justify-between p-4 z-10">
            <button
              type="button"
              aria-expanded={showCode}
              className={`px-4 py-2 rounded-full border border-tertiary text-sm hover:bg-tertiary transition-colors duration-base ${
                showCode ? 'bg-tertiary' : ''
              }`}
              onClick={() => setShowCode((s) => !s)}
            >
              {showCode ? 'Hide code' : 'Show code'}
            </button>
            <CopyToClipboard text={source} onCopy={() => toast.success(`Copied ${name} code to clipboard!`)}>
              <button
                type="button"
                aria-label={`Copy ${name} source`}
                className="flex justify-center items-center w-10 h-10 border border-tertiary rounded-full hover:bg-accent transition-colors duration-base"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </CopyToClipboard>
          </div>
        )}

        <div
          className={`flex flex-wrap justify-center items-center gap-4 px-8 ${source ? 'pt-24' : 'pt-12'} pb-12 ${
            stageClassName ?? ''
          }`}
        >
          {children}
        </div>

        {showCode && source && (
          <div className="px-4 pb-4">
            <CodeBlock code={source} />
          </div>
        )}
      </div>

      {usage && <CodeBlock code={usage} />}
    </section>
  );
};

export default DocExample;
