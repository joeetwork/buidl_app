'use client';

import React, { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
}

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  name,
}: InputProps) {
  return (
    <div className="w-full">
      {label}
      <input
        name={name}
        onChange={onChange}
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        className="input input-ghost bg-gray-500 w-full"
      />
    </div>
  );
}
