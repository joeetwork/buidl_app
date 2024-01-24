'use client';

import React, { useState } from 'react';

interface DropdownProps {
  label?: string;
  items: string[];
  onClick: () => void;
}

export default function Dropdown({ label, items, onClick }: DropdownProps) {
  const [isActive, setIsActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>(items[0]);

  const handleSelectClick = (item: string) => {
    onClick();
    setSelectedItem(item);
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
        <div onClick={handleDropdownClick}>
          <summary className="m-1 btn">{selectedItem}</summary>

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