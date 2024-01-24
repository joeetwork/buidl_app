import React from 'react';

interface DropdownProps {
  label: string;
  onClick?: () => void;
}

export default function Dropdown({ label, onClick }: DropdownProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 m-auto">
        <label>{label}</label>
      </div>
      <div className="flex col-span-3">
        <details className="dropdown">
          <summary className="m-1 btn">open or close</summary>
          <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
}
