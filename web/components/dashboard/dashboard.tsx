'use client';

import React, { useState } from 'react';
import { FREELANCEROLES, ROLES } from '@/constants';
import Dev from './dev';
import Validator from './validator';
import Collection from './collection';
import Tabs from '../shared/tabs';
import Client from './client';
import { useAccounts } from '@/hooks/get-accounts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const { userAccount } = useAccounts();

  const FreelancerRoles = [
    <Dev key="dev" />,
    <Collection key="collection" />,
    <Validator key="validator" />,
  ];

  const ClientRoles = [
    <Client key="client" />,
    <Collection key="collection" />,
    <Validator key="validator" />,
  ];

  const Roles = userAccount.data?.freelancer ? FreelancerRoles : ClientRoles;

  return (
    <div className="flex flex-col gap-4 pt-4 pb-10 mx-10">
      <Tabs
        tabs={userAccount.data?.freelancer ? FREELANCEROLES : ROLES}
        setTab={setActiveTab}
        activeTab={activeTab}
        className="m-auto"
      />
      <div className="flex flex-col gap-4">{Roles[activeTab]}</div>
    </div>
  );
}
