'use client';

import { useAccounts } from '@/hooks/get-accounts';
import { useInitialiseUser } from '@/hooks/initialize-user';
import React, { useEffect, useState } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

type UserProps = anchor.IdlAccounts<AnchorEscrow>['user'] | null;

export function UserType() {
  const { initializeUser } = useInitialiseUser();
  const { userAccount } = useAccounts();

  const [account, setAccount] = useState<UserProps>();

  const handleSubmit = (role: string) => {
    if (account && role) {
      initializeUser.mutateAsync({
        name: account.username,
        about: account.about,
        role,
        pfp: account.pfp,
        links: account.links,
      });
    }
  };

  useEffect(() => {
    setAccount(userAccount.data);
  }, [userAccount.data?.role]);

  const USERTYPES = ['Freelancer', 'Client'];

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-primary rounded-btn">
        {userAccount.data?.role}
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4"
      >
        {USERTYPES.map((name) => (
          <li key={name}>
            <button
              className={`btn btn-sm ${
                userAccount.data?.role === name ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => handleSubmit(name)}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}