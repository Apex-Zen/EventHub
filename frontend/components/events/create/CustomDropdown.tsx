'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  id?: string;
  label?: string;
  value: string;
  options: readonly string[] | string[];
  placeholder?: string;
  onChange: (value: string) => void;
  helperText?: string;
}

export default function CustomDropdown({
  id,
  label,
  value,
  options,
  placeholder = 'Select an option',
  onChange,
  helperText,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#1B2430] mb-2"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-md text-sm text-[#1B2430] transition-colors focus:outline-none focus:ring-1 focus:ring-[#266665] focus:border-[#266665] ${
          isOpen ? 'border-[#266665] ring-1 ring-[#266665]' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <span className={value ? 'text-[#1B2430]' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#266665]' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-30 w-full mt-1.5 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto py-1 focus:outline-none"
        >
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#266665] text-white font-medium'
                    : 'text-[#1B2430] hover:bg-[#266665] hover:text-white'
                }`}
              >
                <span>{option}</span>
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {helperText && (
        <p className="text-xs text-gray-400 mt-1.5">{helperText}</p>
      )}
    </div>
  );
}

