import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, rightElement, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 pt-1">
        {label && (
          <label className="text-sm font-black tracking-tight text-foreground/40 uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`flex h-12 w-full rounded-xl border border-border-standard bg-surface px-4 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
              rightElement ? 'pr-12' : ''
            } ${
              error ? 'border-red-500 focus-visible:ring-red-500' : ''
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter mt-0.5">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
