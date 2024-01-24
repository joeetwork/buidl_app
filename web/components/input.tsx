'use client';

import React from 'react';

interface InputProps {
  label?: string;
  onChange: () => void;
}

export default function Input({ label, onChange }: InputProps) {
  return (
    <div>
      {label && (
        <div className="text-left">
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
