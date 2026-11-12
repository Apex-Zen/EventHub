'use client';

import React, { useState, useRef, useEffect, useId } from 'react';

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
  id: externalId,
  label,
  value,
  options,
  placeholder = 'Select an option',
  onChange,
  helperText,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const internalId = useId();
  const dropdownId = externalId || internalId;
  const listboxId = `${dropdownId}-listbox`;

  // Sync highlightedIndex when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.indexOf(value);
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, options, value]);

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const activeElement = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // Keyboard navigation handler on the container/button
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            handleSelect(options[highlightedIndex]);
          }
        } else {
          setIsOpen(true);
        }
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
      }
      case 'Home': {
        if (isOpen) {
          event.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      }
      case 'End': {
        if (isOpen) {
          event.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
      }
      case 'Escape': {
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
        }
        break;
      }
      case 'Tab': {
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      }
      default:
        break;
    }
  };

  const activeOptionId =
    isOpen && highlightedIndex >= 0 ? `${dropdownId}-option-${highlightedIndex}` : undefined;

  return (
    <div className="relative" ref={containerRef} onKeyDown={handleKeyDown}>
      {label && (
        <label
          htmlFor={dropdownId}
          className="block text-sm font-medium text-[#1B2430] mb-2"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={buttonRef}
        id={dropdownId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
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
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={activeOptionId}
          className="absolute z-30 w-full mt-1.5 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto py-1 focus:outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option}
                id={`${dropdownId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                  isHighlighted || isSelected
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
