'use client';

import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** When true, uses the same styling as hover (accent background, dark text) */
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', active = false, children, className = '', disabled, ...props },
  ref
) {
  const base = 'btn rounded border py-2.5 px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const activeClass = active ? 'btn-active' : '';

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={`${base} ${variantClass} ${activeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
});
