'use client';
import React, { useState } from 'react';

interface SelectUserProps {
  onChange: (e: string) => void;
}

export default function SelectUser({ onChange }: SelectUserProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  return (
    <div
      className={`bg-gray-500 rounded-lg p-4 w-full hover:ring ${
        isHighlighted ? 'ring ring-gray-400 ' : 'hover:ring-gray-700'
      }`}
    >
      <div className="w-full">
        <span className="label-text cursor-default">Add Validator</span>
      </div>
      <div className="flex justify-between w-full">
        <input
          name="initializerAmount"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsHighlighted(true)}
          onBlur={() => setIsHighlighted(false)}
          type="text"
          placeholder="SoliRxTzQ3sbz4it..."
          className="input input-ghost input-md p-0 text-lg bg-gray-500 focus:outline-none w-full"
        />
      </div>
    </div>
  );
}
