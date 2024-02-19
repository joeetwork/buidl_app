'use client';

import React, { useState } from 'react';
import Input from '../shared/input';
import { useInitialiseUser } from '@/hooks/initialize-user';
import Select from '../shared/select';
import { ROLES } from '@/constants';

export default function CreateUser() {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [role, setRole] = useState(ROLES[0]);

  const { initializeUser } = useInitialiseUser();

  const handleSubmit = () => {
    initializeUser.mutateAsync({ name, about, role });
  };

  return (
    <>
      <div className="flex flex-col gap-4 pb-4 items-center">
        <Input label="Name:" onChange={(e) => setName(e.target.value)} />

        <Input label="About:" onChange={(e) => setAbout(e.target.value)} />

        <Select label="Role:" items={ROLES} onClick={(v) => setRole(v)} />
      </div>
      <button onClick={handleSubmit} className="btn">
        Create account
      </button>
    </>
  );
}
