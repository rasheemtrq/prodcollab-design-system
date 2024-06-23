'use client'

import React, { useState } from 'react';
import Header01 from '@/app/page-components/body/Header01';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Avatar from '@/app/design-system/components/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { avatarCode } from '@/utils/componentCode';

const AvatarPage: React.FC = () => {
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

    const handleClick = () => {
        console.log('Avatar clicked!');
    };

    return (
        <div>
            <Header01 />
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            <div className="flex flex-col h-full gap-8">
                {/* Avatar */}
                <div className="flex flex-col w-full h-auto justify-center items-center bg-primary border border-secondary py-24 px-8 rounded-[2rem] mb-8 overflow-hidden relative">
                    <div className="absolute top-0 flex justify-between w-full p-4">
                        <button
                            className={`px-4 py-2 rounded-full border border-tertiary text-sm hover:bg-tertiary transition-all 200ms ${showCode['Avatar'] ? 'bg-tertiary text-white' : 'text-primary'}`}
                            onClick={() => toggleShowCode('Avatar')}
                        >
                            {showCode['Avatar'] ? 'Hide Code' : 'Show Code'}
                        </button>
                        <CopyToClipboard text={avatarCode} onCopy={() => handleCopy(avatarCode, 'Avatar')}>
                            <div className="flex justify-center items-center text-primary cursor-pointer w-10 h-10 border border-tertiary rounded-full hover:bg-blue-500 transition-all 200ms">
                                <FontAwesomeIcon icon={faCopy} />
                            </div>
                        </CopyToClipboard>
                    </div>

                    <div className="flex gap-4">
                        <Avatar src="/images/logo-256.png" alt="avatar" />
                        <Avatar src="/images/logo-256.png" alt="avatar" variant="square" />
                        <Avatar src="/images/logo-256.png" alt="avatar" variant="round" />
                    </div>
                    <div className="w-[44rem]">
                        {showCode['Avatar'] && (
                            <SyntaxHighlighter language="tsx" style={customStyle}>
                                {avatarCode.trim()}
                            </SyntaxHighlighter>
                        )}
                    </div>
                </div>
                <div className="flex flex-col w-full h-auto justify-center items-center bg-primary border border-secondary rounded-[2rem] mb-8 overflow-hidden relative">
                    <pre className="text-secondary text-sm py-8">
                        <code>
                            {`
<Avatar src="/images/logo-256.png" alt="avatar"/>
<Avatar src="/images/logo-256.png" alt="avatar" variant="square"/>
<Avatar src="/images/logo-256.png" alt="avatar" variant="round"/>
            `}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default AvatarPage;
