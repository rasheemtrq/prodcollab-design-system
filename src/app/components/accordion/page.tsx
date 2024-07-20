'use client'

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Accordion from '@/app/design-system/components/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { accordionCode } from '@/utils/componentCode';
import Link from 'next/link';
import Image from 'next/image';

const AccordionPage: React.FC = () => {
    const [showCode, setShowCode] = useState<{ [key: string]: boolean }>({
    });

    const toggleShowCode = (componentName: string) => {
        setShowCode((prevState) => ({
            ...prevState,
            [componentName]: !prevState[componentName],
        }));
    };

    const handleCopy = (code: string, componentName: string) => {
        toast.success(`Copied ${componentName} code to clipboard!`);
    };

    const customStyle = {
        ...atomDark,
        'code[class*="language-"]': {
            fontSize: '12px',
            lineHeight: '1.5',
            color: 'white',
        },
        'pre[class*="language-"]': {
            maxWidth: '45rem',
            maxHeight: 'auto',
            overflow: 'auto',
            marginTop: '6rem'
        },
    };

    const accordionItems = [
        { title: 'What is ProdCollab?', content: 'ProdCollab is an online DAW for music producers and artists to collaborate in real time.' },
        { title: 'How can I use this design system?', content: 'Download or clone from the GitHub repo, and follow the README.md' },
        { title: 'When is the product releasing?', content: 'As soon as we get most of the product up and running!' },
        // Add more sections as needed
    ];

    return (
        <div>
            <Header01 />
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <div className="flex flex-col h-full gap-8">
                {/* Accordion */}
                <div className="flex flex-col w-full h-auto justify-center items-center bg-primary border border-secondary py-24 px-8 rounded-[2rem] mb-8 overflow-hidden relative">
                    <div className="absolute top-0 flex justify-between w-full p-4">
                        <button
                            className={`px-4 py-2 rounded-full border border-tertiary text-sm hover:bg-tertiary transition-all 200ms ${showCode['Avatar'] ? 'bg-tertiary text-white' : 'text-primary'}`}
                            onClick={() => toggleShowCode('Accordion')}
                        >
                            {showCode['Accordion'] ? 'Hide Code' : 'Show Code'}
                        </button>
                        <CopyToClipboard text={accordionCode} onCopy={() => handleCopy(accordionCode, 'Accordion')}>
                            <div className="flex justify-center items-center text-primary cursor-pointer w-10 h-10 border border-tertiary rounded-full hover:bg-blue-500 transition-all 200ms">
                                <FontAwesomeIcon icon={faCopy} />
                            </div>
                        </CopyToClipboard>
                    </div>

                    {/* Display Component Here */}
                    <div className="w-80 mx-auto flex flex-col gap-4">
                        <Accordion items={accordionItems} numberOfRows={3} />
                    </div>

                    {/* Show Component Code */}
                    <div className="w-[44rem]">
                        {showCode['Accordion'] && (
                            <SyntaxHighlighter language="tsx" style={customStyle}>
                                {accordionCode.trim()}
                            </SyntaxHighlighter>

                        )}
                    </div>

                </div>
                <p>
                    1. Make sure to add this local variable within <code className="text-sm bg-secondary px-2 py-1 rounded-md border border-tertiary mx-1">app.tsx</code>
                </p>
                <div className="flex flex-col w-full h-auto justify-center items-center bg-primary border border-secondary rounded-[2rem] mb-8 overflow-hidden relative">
                    <pre className="text-secondary text-sm py-8">
                        <code>
                            {`
const accordionItems = [
{ title: 'Heading 1', content: 'Description here.' },
{ title: 'Heading 2', content: 'Description here.' },
{ title: 'Heading 3', content: 'Description here.' },
// Add more sections as needed
];
            `}
                        </code>
                    </pre>
                </div>
                <p>
                    2. Import the component and add <code className="text-sm bg-secondary px-2 py-1 rounded-md border border-tertiary mx-1">{`<Accordion items={accordionItems} numberOfRows={3} />`}</code>
                </p>
            </div>
        </div>
    );
};

export default AccordionPage;
