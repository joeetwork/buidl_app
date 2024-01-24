import React from 'react';
import Input from '../input';
import Dropdown from '../dropdown';

export default function User() {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Name:"
        onChange={() => {
          return;
        }}
      />

      <Input
        label="About:"
        onChange={() => {
          return;
        }}
      />

      <Dropdown label="Role:" items={['Item 1', 'Item 2']}/>
    </div>
  );
}
