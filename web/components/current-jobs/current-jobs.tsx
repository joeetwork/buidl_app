'use client';

import React, { useState } from 'react';
import { ROLES } from '@/constants';
import Tabs from '../shared/tabs';
import HiringUi from './hiring-ui';
import DevUi from './dev-ui';
import CollectionUi from './collection-ui';
import ValidatorUi from './validator-ui';

export default function CurrentJobs() {
  const [activeTab, setActiveTab] = useState(0);

  const Roles = [
    <DevUi key="dev" />,
    <HiringUi key="hiring" />,
    <CollectionUi key="collection" />,
    <ValidatorUi key="validator" />,
  ];

  return (
    <div className="flex flex-col items-center">
      <Tabs
        tabs={ROLES}
        setTab={setActiveTab}
        activeTab={activeTab}
        className="mt-4"
      />

      {Roles[activeTab]}
    </div>
  );
}
