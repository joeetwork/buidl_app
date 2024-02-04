'use client';

import React from 'react';

interface SelectProps {
  label?: string;
  items: string[];
  onClick: (value: string) => void;
}

export default function Select({ label, items, onClick }: SelectProps) {
  const handleSelectClick = (item: string) => {
    onClick(item);
  };
  items.push('gg')
  return (
    <label className="form-control w-full max-w-xs">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}

      <select
        onChange={(e) => handleSelectClick(e.target.value)}
        className="select select-bordered"
      >
        {items.map((item, i) => {
          return (
            <option key={i} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </label>
  );
}
