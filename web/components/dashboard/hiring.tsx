'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React from 'react';

export default function Hiring() {
  const { uploadEmployerHistory } = useAccounts();

  return (
    <>
      <div className="flex justify-between gap-4">
        <div className="card w-80 bg-base-100 shadow-xl m-auto h-56">
          <p className="text-center pt-2">Stats</p>
        </div>
        <div className="card w-80 bg-base-100 shadow-xl m-auto h-56">
          <p className="text-center pt-2">History</p>
        </div>
      </div>

      <div className="flex card w-full bg-base-100 shadow-xl m-auto">
        <p className="text-center pt-2">Active</p>
        <div className="flex flex-col">
          {uploadEmployerHistory.data?.map((work) => {
            return (
              <div
                key={work.publicKey.toString()}
                className="card w-80 bg-base-100 shadow-xl m-auto"
              >
                <div className="card-body">
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
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
