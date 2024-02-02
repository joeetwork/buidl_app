'use client';

import React, { useState } from 'react';

interface DropdownProps {
  label?: string;
  items: string[];
  value: string;
  onClick: (value: string) => void;
}

export default function Dropdown({
  label,
  items,
  value,
  onClick,
}: DropdownProps) {
  const [isActive, setIsActive] = useState(false);

  const handleSelectClick = (item: string) => {
    onClick(item);
    setIsActive(false);
  };

  const handleDropdownClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="text-left">
      {label && (
        <div>
          <label>{label}</label>
        </div>
      )}
      <div>
        <div>
          <summary onClick={handleDropdownClick} className="btn">
            {value ? value : items[0]}
          </summary>

          {isActive ? (
            <ul className="p-2 shadow menu fixed z-[1] bg-base-100 rounded-box w-52">
              {items.map((item, i) => {
                return (
                  <li key={i} onClick={() => handleSelectClick(item)}>
                    <a>{item}</a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
