'use client';

import React, { useState } from 'react';

interface InputProps {
  label?: string;
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, name, onChange }: InputProps) {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange(e);
  };

  return (
    <label className="form-control w-full max-w-xs">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}

      <input
        name={name}
        type="text"
        placeholder="Type here"
        value={value}
        className="input input-bordered w-full max-w-xs"
        onChange={handleChange}
      />
    </label>
  );
}
