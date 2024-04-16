'use client';

import { useAccounts } from '@/hooks/get-accounts';
import { useInitialiseUser } from '@/hooks/initialize-user';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function UserType() {
  const { initializeUser } = useInitialiseUser();
  const { userAccount } = useAccounts();
  const router = useRouter();

  const handleSubmit = (role: string) => {
    if (userAccount.data && role) {
      initializeUser.mutateAsync({
        name: userAccount.data.username,
        about: userAccount.data.about,
        role,
        pfp: userAccount.data.pfp,
        links: userAccount.data.links,
      });
    }
  };

  useEffect(() => {
    if (userAccount.data?.role === 'Client') {
      router.push('/contracts');
    }

    if (userAccount.data?.role === 'Freelancer') {
      router.push('/requests');
    }
  }, [initializeUser.isSuccess]);

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
