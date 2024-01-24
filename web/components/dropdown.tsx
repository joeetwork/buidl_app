import React, { useState } from 'react';

interface DropdownProps {
  label: string;
  items: string[];
  onClick?: () => void;
}

export default function Dropdown({ label, items, onClick }: DropdownProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 m-auto">
        <label>{label}</label>
      </div>
      <div className="flex col-span-3">
        <details>
          <summary onClick={() => setIsActive(!isActive)} className="m-1 btn">
            open or close
          </summary>

          {isActive ? (
            <ul className="p-2 shadow menu fixed z-[1] bg-base-100 rounded-box w-52">
              {items.map((item, i) => {
                return (
                  <li key={i}>
                    <a>{item}</a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </details>
      </div>
    </div>
  );
}
