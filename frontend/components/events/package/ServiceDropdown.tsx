'use client';

import React, { useState, useRef, useEffect, useId } from 'react';

interface ServiceDropdownProps {
  id?: string;
  value: string;
  options: readonly string[] | string[];
  onChange: (value: string) => void;
}

export default function ServiceDropdown({
  id: externalId,
  value,
  options,
  onChange,
}: ServiceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const internalId = useId();
  const dropdownId = externalId || internalId;
  const listboxId = `${dropdownId}-listbox`;

  useEffect(() => {
    if (isOpen) {
      const selectedIndex = options.indexOf(value);
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, options, value]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const activeElement = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

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
    <div className="relative inline-block w-full max-w-[210px]" ref={containerRef} onKeyDown={handleKeyDown}>
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
        className={`w-full flex items-center justify-between bg-white border rounded px-3 py-1.5 text-xs text-[#1B2430] transition-colors focus:outline-none focus:ring-1 focus:ring-[#266665] focus:border-[#266665] cursor-pointer ${
          isOpen ? 'border-[#266665] ring-1 ring-[#266665]' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <span className="truncate pr-1.5 text-left">{value}</span>
        <svg
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-[#266665]' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={activeOptionId}
          className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto py-1 focus:outline-none text-left"
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
                className={`px-3 py-1.5 text-xs cursor-pointer transition-colors flex items-center justify-between ${
                  isHighlighted || isSelected
                    ? 'bg-[#266665] text-white font-medium'
                    : 'text-[#1B2430] hover:bg-[#266665] hover:text-white'
                }`}
              >
                <span className="truncate mr-2">{option}</span>
                {isSelected && (
                  <svg
                    className="w-3.5 h-3.5 text-white flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

