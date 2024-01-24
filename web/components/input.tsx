'use client'

import React from 'react';

interface InputProps {
  label: string;
  onChange: () => void;
}

export default function Input({ label, onChange }: InputProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 m-auto">
        <label>{label}</label>
      </div>
      <div className="flex col-span-3">
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
