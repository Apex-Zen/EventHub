import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function SecondaryButton({ children, className = '', ...props }: SecondaryButtonProps) {
  return (
    <button 
      className={`px-6 py-2.5 bg-white text-[#266665] border border-gray-300 text-sm font-medium rounded hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
