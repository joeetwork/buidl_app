'use client';

import React, { ChangeEvent } from 'react';

interface TextAreaProps {
  label: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export default function TextArea({
  label,
  onChange,
  placeholder,
}: TextAreaProps) {
  return (
    <div className="w-full">
      {label}
      <textarea
        className="textarea textarea-lg w-full resize-none bg-gray-500"
        name={label.toLowerCase()}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}
