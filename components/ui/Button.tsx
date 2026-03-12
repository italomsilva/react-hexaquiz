import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-neon text-background hover:bg-[#b3e600] shadow-[0_0_15px_rgba(204,255,0,0.4)] hover:shadow-[0_0_25px_rgba(204,255,0,0.7)]',
      secondary: 'bg-[#1a1a1a] text-foreground hover:bg-[#2a2a2a] border border-[#333]',
      outline: 'bg-transparent border-2 border-neon text-neon hover:bg-neon hover:text-background shadow-[0_0_10px_rgba(204,255,0,0.2)] hover:shadow-[0_0_20px_rgba(204,255,0,0.5)]',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-12 px-8 text-base',
      lg: 'h-14 px-10 text-lg uppercase tracking-wider',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
