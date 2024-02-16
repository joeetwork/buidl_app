'use client';

import React, { useState } from 'react';
import Select from '../shared/select';
import { ROLES } from '@/constants';
import Dev from './dev';
import Hiring from './hiring';
import Validator from './validator';
import Collection from './collection';

export default function Dashboard() {
  const [role, setRole] = useState(0);

  const Roles = [
    <Dev key="dev" />,
    <Hiring key="hiring" />,
    <Validator key="validator" />,
    <Collection key="collection" />,
  ];

  return (
    <div className="flex flex-col gap-4 pt-4 pb-10">
      <Select
        label="Role:"
        items={ROLES}
        onClick={(v) => setRole(ROLES.findIndex((role) => role === v))}
      />
      <div className="flex flex-col m-auto gap-4">{Roles[role]}</div>
    </div>
  );
}
