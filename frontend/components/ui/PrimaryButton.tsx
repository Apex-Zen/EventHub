import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({ children, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button 
      className={`px-6 py-3 bg-[#266665] text-white text-sm font-semibold rounded-md hover:bg-[#1a4a49] transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}