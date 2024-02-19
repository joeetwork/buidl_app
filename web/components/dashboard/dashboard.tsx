'use client';

import React, { useState } from 'react';
import { ROLES } from '@/constants';
import Dev from './dev';
import Hiring from './hiring';
import Validator from './validator';
import Collection from './collection';
import Tabs from '../shared/tabs';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const Roles = [
    <Dev key="dev" />,
    <Hiring key="hiring" />,
    <Collection key="collection" />,
    <Validator key="validator" />,
  ];

  return (
    <div className="flex flex-col gap-4 pt-4 pb-10 mx-10">
      <Tabs
        tabs={ROLES}
        setTab={setActiveTab}
        activeTab={activeTab}
        className="m-auto"
      />
      <div className="flex flex-col gap-4">{Roles[activeTab]}</div>
    </div>
  );
}
