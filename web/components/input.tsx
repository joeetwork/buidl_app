'use client';

import React from 'react';

interface InputProps {
  label?: string;
  onChange: () => void;
}

export default function Input({ label, onChange }: InputProps) {
  return (
    <div className="flex items-center gap-4">
      {label && (
        <div>
          <label>{label}</label>
        </div>
      )}
      <div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
