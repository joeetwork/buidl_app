'use client';

import React, { ChangeEvent, useState } from 'react';

interface InputProps {
  label: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  contained?: boolean;
}

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  name,
  contained = false,
}: InputProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  return (
    <div
      className={
        contained
          ? `bg-teal-700 rounded-lg p-4 w-full hover:ring ${
              isHighlighted ? 'ring ring-teal-400 ' : 'hover:ring-teal-600'
            }`
          : ''
      }
    >
      <div className="w-full">
        <span className="label-text cursor-default">{label}</span>
      </div>
      <div className="flex justify-between w-full">
        <input
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsHighlighted(true)}
          onBlur={() => setIsHighlighted(false)}
          type="text"
          placeholder={placeholder}
          className={`input input-ghost bg-teal-700 w-full ${
            contained &&
            'input-md p-0 text-lg bg-teal-700 focus:outline-none w-full'
          }`}
        />
      </div>
    </div>
  );
}
