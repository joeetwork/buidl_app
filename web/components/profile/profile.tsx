'use client';

import React from 'react';
import { useAccounts } from '@/hooks/get-accounts';
import Avatar from '../shared/avatar';

export default function Profile() {
  const { userAccount } = useAccounts();

  const pfp = `${
    userAccount.data?.pfp ??
    'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
  }`;

  return (
    <div className="flex flex-col mx-[10%] h-full pt-4">
      <div className="relative w-full h-[170px]">
        <div className="bg-red-500 w-full h-3/4" />
        <div className="absolute top-[65px] left-[33px]">
          <Avatar src={pfp} />
        </div>
      </div>

      <div className="h-full flex ">
        <div className="w-1/4 ml-2">
          <h1 className="text-2xl truncate">
            {userAccount.data?.username ==
            userAccount.data?.initializer.toString()
              ? 'Guest'
              : userAccount.data?.username}
          </h1>
          <h3 className="text-lg truncate">
            {userAccount.data?.initializer.toString()}
          </h3>
        </div>
      </div>
    </div>
  );
}
