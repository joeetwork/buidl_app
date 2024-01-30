'use client';

import React, { useState } from 'react';
import Input from '../shared/input';
import Dropdown from '../shared/dropdown';
import { useInitialiseUser } from '@/hooks/initialize-user';

const dropDownItems = ['Dev', 'Hiring'];

export default function CreateUser() {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [role, setRole] = useState(dropDownItems[0]);

  const { initializeUser } = useInitialiseUser();

  const handleSubmit = () => {
    initializeUser.mutateAsync({ name, about, role });
  };

  return (
    <>
      <div className="flex flex-col gap-4 pb-4">
        <Input
          label="Name:"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="About:"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <Dropdown
          label="Role:"
          items={dropDownItems}
          value={role}
          onClick={(v) => setRole(v)}
        />
      </div>
      <button onClick={handleSubmit} className="btn">
        Create account
      </button>
    </>
  );
}
