'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React from 'react';

export default function HiringUi() {
  const { userEscrows } = useAccounts();

  return (
    <div>
      {userEscrows.data?.map((escrow) => {
        return (
          <div key={escrow.publicKey.toString()}>
            <div>{escrow.account.status}</div>
            <div>{escrow.account.about}</div>
          </div>
        );
      })}
    </div>
  );
}
