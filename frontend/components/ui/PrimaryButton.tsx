import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({ children, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button 
      className={`px-5 py-2.5 bg-[#266665] hover:bg-[#123B3A] active:bg-[#123B3A] text-white text-sm font-medium rounded transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}