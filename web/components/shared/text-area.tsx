'use client';

import React, { ChangeEvent, useState } from 'react';

interface TextAreaProps {
  label: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  contained?: boolean;
}

export default function TextArea({
  label,
  onChange,
  placeholder,
  contained = false,
}: TextAreaProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  return (
    <div
      className={
        contained
          ? `bg-gray-500 rounded-lg p-4 w-full hover:ring ${
              isHighlighted ? 'ring ring-gray-400' : 'hover:ring-gray-700'
            }`
          : ''
      }
    >
      <div className="w-full">
        <span className="label-text cursor-default">{label}</span>
      </div>
      <textarea
        className={`textarea textarea-lg w-full resize-none bg-gray-500 ${
          contained && 'focus:outline-none p-0'
        }`}
        name={label.toLowerCase()}
        onFocus={() => setIsHighlighted(true)}
        onBlur={() => setIsHighlighted(false)}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
