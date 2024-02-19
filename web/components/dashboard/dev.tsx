'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React from 'react';
import { AppHero } from '../shared/app-hero';
import CreateUser from '../user/create-user';

export default function Dev() {
  const { uploadDevHistory, userAccount } = useAccounts();

  return (
    <>
      {userAccount.data ? (
        <>
          <div className="flex justify-between gap-4">
            <div className="card w-full bg-base-100 shadow-xl h-56">
              <p className="text-center pt-2">Stats</p>
            </div>
            <div className="card w-full bg-base-100 shadow-xl h-56">
              <p className="text-center pt-2">History</p>
            </div>
          </div>

          <div className="flex card w-full bg-base-100 shadow-xl min-h-[250px]">
            <p className="text-center pt-2">Active</p>
            <div className="grid grid-cols-3 gap-4 items-stretch">
              {uploadDevHistory.data?.map((work) => {
                return (
                  <div
                    key={work.publicKey.toString()}
                    className="card-body w-80 card bg-base-100 shadow-xl m-auto"
                  >
                    <h2 className="text-center font-bold">Upload</h2>
                    <p>Amount: {work.account.amount.toString()}</p>
                    <p className="w-full break-words">
                      About: {work.account.about}
                    </p>

                    <button
                      className="btn"
                      onClick={() => window.open(work.account.uploadWork)}
                    >
                      Work
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <AppHero title={'Looking for a gig?'} subtitle={'Sign up below!'}>
          <CreateUser />
        </AppHero>
      )}
    </>
  );
}
