'use client';

import React, { useId } from 'react';

type InputFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Placeholder text. A trailing "*" is stripped (use `required` instead). */
  label: string;
  variant: 'error' | 'outlined' | 'password' | 'default';
  /** Message shown under an error field. */
  errorMessage?: string;
};

const variantClasses = {
  error: 'bg-secondary border border-danger',
  outlined: 'bg-transparent border-2 border-line-control',
  password: 'bg-secondary border border-line-control',
  default: 'bg-secondary border border-line-control',
};

const InputField: React.FC<InputFieldProps> = ({
  label = 'Type here',
  variant,
  required = true,
  errorMessage = 'Invalid input. Please try again.',
  className = '',
  ...rest
}) => {
  const errorId = useId();
  const isError = variant === 'error';
  const text = label.replace('*', '').trim();

  return (
    <div className="flex flex-col relative">
      <input
        type={variant === 'password' ? 'password' : 'text'}
        aria-label={text}
        aria-invalid={isError || undefined}
        aria-describedby={isError ? errorId : undefined}
        required={required}
        placeholder={text}
        className={`peer px-4 py-2 pr-8 rounded-lg text-primary placeholder:text-subtle outline-none focus:border-accent transition-colors duration-base disabled:opacity-40 ${variantClasses[variant]} ${className}`}
        {...rest}
      />
      {required && (
        <span aria-hidden className="absolute right-3 top-2.5 text-danger peer-focus:opacity-0 transition-opacity duration-base">
          *
        </span>
      )}
      {isError && (
        <p id={errorId} className="text-danger text-xs mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default InputField;
