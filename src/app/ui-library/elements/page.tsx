// src/app/component-library/elements/page.tsx
'use client'

import React, { useState } from 'react';
import Header01 from "@/components/body/Header01";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Button from '@/components/elements/Button';
import InputField from '@/components/elements/InputField';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify'; // Import toast components and styles
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const ElementsPage: React.FC = () => {
  const [showCodeButton, setShowCodeButton] = useState<{ [key: string]: boolean }>({
    Button: false,
    InputField: false
  });

  const toggleShowCodeButton = (componentName: string) => {
    setShowCodeButton(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => ({
        ...acc,
        [key]: key === componentName ? !prevState[key] : prevState[key],
      }), {}),
    }));
  };

  const buttonCode = `
    // src/components/elements/Button.tsx
    'use client'

    import React from 'react';

    interface ButtonProps {
      onClick?: () => void; // Make sure onClick is optional
      disabled?: boolean;
      text?: string;
      variant?: 'secondary' | 'error' | 'default';
    }

    const Button: React.FC<ButtonProps> = ({
      onClick = () => {}, // Provide a default function to prevent onClick from being null
      disabled = false,
      text = 'Button',
      variant = 'default'
    }) => {
      // Determine button color based on variant
      let buttonColorClass = '';
      switch (variant) {
        case 'error':
          buttonColorClass = 'bg-red-500 hover:bg-red-600 text-white';
          break;
        case 'secondary':
          buttonColorClass = 'border border-tertiary hover:bg-tertiary text-white';
          break;
        default:
          buttonColorClass = 'bg-blue-500 hover:bg-blue-600 text-white';
      }

      return (
        <button
          onClick={onClick}
          disabled={disabled}
          className={\`px-4 py-2 rounded-full transition-all ease-out duration-100 \${buttonColorClass}\`}
        >
          {text}
        </button>
      );
    };

    export default Button;
  `;

  const inputfieldCode = `
    // src/components/elements/InputField.tsx
    'use client'

    import React, { useState } from 'react';
    
    interface InputFieldProps {
      disabled?: boolean;
      label: string;
      variant: 'error' | 'outlined' | 'password' | 'default';
    }
    
    const InputField: React.FC<InputFieldProps> = ({ disabled, label = 'Type here', variant }) => {
      const [showAsterisk, setShowAsterisk] = useState(true);
    
      // Determine input field color and additional classes based on variant
      let inputStateClass = '';
      let inputLabelClass = '';
      let inputType = 'text';
    
      switch (variant) {
        case 'error':
          inputStateClass = 'border border-red-500 text-black';
          inputLabelClass = 'block';
          break;
        case 'outlined':
          inputStateClass = 'bg-transparent border-2 border-tertiary text-gray-600';
          inputLabelClass = 'hidden';
          break;
        case 'password':
          inputType = 'password';
          inputStateClass = 'border border-gray-200 text-black';
          inputLabelClass = 'hidden';
          break;
        default:
          inputStateClass = 'border border-gray-200 text-black';
          inputLabelClass = 'hidden';
      }
    
      return (
        <div className="flex flex-col mb-4 relative">
          <input
            type={inputType}
            disabled={disabled}
            className={\`px-4 py-2 rounded-lg font-custom \${inputStateClass}\`}
            placeholder={label.replace('*', '')} // Removing the asterisk from the placeholder
            onFocus={() => setShowAsterisk(false)}
            onBlur={() => setShowAsterisk(true)}
          />
          {showAsterisk && (
            <span className="absolute right-3 top-5 transform -translate-y-1/2 text-red-500">*</span>
          )}
          {/* Error Message */}
          <label className={\`text-red-500 text-xs mt-1 \${inputLabelClass}\`}>
            Invalid input. Please try again.
          </label>
        </div>
      );
    };
    
    export default InputField;
  `;

  const customStyle = {
    ...a11yDark,
    'code[class*="language-"]': {
      fontSize: '12px',
      lineHeight: '1.5',
    },
    'pre[class*="language-"]': {
      maxWidth: '45rem',
      maxHeight: 'auto',
      overflow: 'auto',
    },
  };

  const handleCopy = (code: string, componentName: string) => {
    // Notify that code has been copied
    toast.success(`Copied ${componentName} code to clipboard!`);
  };

  return (
    <div>
      <Header01 />
      {/* Toast Container for notifications */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      <div className="flex flex-col h-full gap-8">
        
        {/* Button */}
        <div className="flex flex-col w-full h-auto justify-center items-center bg-secondary py-24 px-8 rounded-[2rem] mb-8 overflow-hidden relative">
          <div className="text-2xl absolute top-6 left-8 inline-flex gap-2">
          Button
          </div>
          <div className="absolute top-4 right-4 inline-flex gap-2">
            <button
              className={`px-4 py-2 rounded-full border border-tertiary ${showCodeButton['Button'] ? 'bg-tertiary text-white' : 'text-primary'}`}
              onClick={() => toggleShowCodeButton('Button')}
            >
              {showCodeButton['Button'] ? 'Hide Code' : 'Show Code'}
            </button>
            {/* Copy Button */}
            <CopyToClipboard text={buttonCode} onCopy={() => handleCopy(buttonCode, 'Button')}>
              <Button text="Copy" />
            </CopyToClipboard>
          </div>
          
          <div className="flex gap-4">
            <Button />
            <Button variant="secondary"/>
            <Button variant="error"/>
          </div>
          
          {showCodeButton['Button'] && (
            <div className="w-[44rem] mt-14">
              <SyntaxHighlighter language="tsx" style={customStyle}>
                {buttonCode.trim()}
              </SyntaxHighlighter>
            </div>
          )}
        </div>

        {/* InputField */}
        <div className="flex flex-col w-full h-auto justify-center items-center bg-secondary py-24 px-8 rounded-[2rem] mb-8 overflow-hidden relative">
          <div className="text-2xl absolute top-6 left-8 inline-flex gap-2">Input Field</div>
          <div className="absolute top-4 right-4 inline-flex gap-2">
            <button
              className={`px-4 py-2 rounded-full border border-tertiary ${showCodeButton['InputField'] ? 'bg-tertiary text-white' : 'text-primary'}`}
              onClick={() => toggleShowCodeButton('InputField')}
            >
              {showCodeButton['InputField'] ? 'Hide Code' : 'Show Code'}
            </button>
            {/* Copy Button */}
            <CopyToClipboard text={inputfieldCode} onCopy={() => handleCopy(inputfieldCode, 'InputField')}>
              <Button text="Copy" />
            </CopyToClipboard>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <InputField label="Text here" variant="default"/>
            <InputField label="Enter password" variant="password"/>
            <InputField label="Text here" variant="outlined"/>
            <InputField label="Type here again" variant="error"/>
          </div>

          {showCodeButton['InputField'] && (
            <div className="w-[44rem] mt-14">
              <SyntaxHighlighter language="tsx" style={customStyle}>
                {inputfieldCode.trim()}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
        
        {/* Add more components as needed */}
      </div>
    </div>
  );
};

export default ElementsPage;
