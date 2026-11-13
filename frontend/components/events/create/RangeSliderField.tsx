import React from 'react';

interface RangeSliderFieldProps {
  label: string;
  valueDisplay: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
}

export default function RangeSliderField({
  label,
  valueDisplay,
  min,
  max,
  step = 1,
  value,
  minLabel,
  maxLabel,
  onChange,
}: RangeSliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#1B2430]">{label}</label>
        <span className="text-sm font-semibold text-[#266665]">
          {valueDisplay}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#266665]"
      />

      {(minLabel || maxLabel) && (
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

