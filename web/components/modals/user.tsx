'use client';

import React from 'react';
import Input from '../input';
import Dropdown from '../dropdown';

interface UserProps {
  user: { name: string; about: string; role: string };
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (value: string) => void;
}

export default function User({ user, onChange, onClick }: UserProps) {
  const { name, about, role } = user;

  const dropDownItems = ['Item 1', 'Item 2'];

  return (
    <div className="flex flex-col gap-4">
      <Input label="Name:" name="name" value={name} onChange={onChange} />

      <Input label="About:" name="about" value={about} onChange={onChange} />

      <Dropdown label="Role:" items={dropDownItems} value={role} onClick={onClick} />
    </div>
  );
}
