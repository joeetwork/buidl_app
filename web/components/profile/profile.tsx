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
    <div className="flex flex-col gap-4 mx-[10%] h-full">
      <div className="bg-gradient-to-b from-emerald-500 via-transparent to-transparent row-span-2 relative w-full flex-2">
        <div className="ml-6 mt-6">
          <Avatar src={pfp} />
        </div>

        <div className="grid grid-cols-2 pb-4 px-6">
          <div>
            <h1 className="text-2xl truncate">
              {userAccount.data?.username ==
              userAccount.data?.initializer.toString()
                ? 'Guest'
                : userAccount.data?.username}
            </h1>
            <h3 className="text-xs truncate">
              {userAccount.data?.initializer.toString()}
            </h3>
          </div>

          <button className="w-[40%] ml-auto btn">Edit Profile</button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-5 gap-4 pb-4">
        <div className="col-span-2 bg-gray-800 pr-6 pl-6">
          Users bio/ descriptions
        </div>

        <div className="col-span-3 grid grid-row-2 gap-4">
          <div className="row-span-1 bg-gray-800"></div>

          <div className="row-span-1 bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
}
