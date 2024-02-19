'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React, { useState } from 'react';
import { AppHero } from '../shared/app-hero';
import CreateUser from '../user/create-user';
import HistoryModal from './history-modal';

export default function Dev() {
  const [showModal, setShowModal] = useState(false);
  const { uploadDevHistory, devEscrows, userAccount } = useAccounts();

  return (
    <>
      {userAccount.data ? (
        <>
          <div className="flex justify-between gap-4">
            <div className="card w-full bg-base-100 shadow-xl h-56">
              <h1 className="text-center pt-2">Stats</h1>
            </div>
            <div className="card w-full bg-base-100 shadow-xl h-56">
              <h1 className="text-center pt-2">History</h1>
              <button
                className="btn btn-primary w-1/4 m-auto"
                onClick={() => setShowModal(true)}
              >
                Show History
              </button>
              <HistoryModal
                uploadHistory={uploadDevHistory?.data}
                hideModal={() => setShowModal(false)}
                show={showModal}
              />
            </div>
          </div>

          <div className="flex card w-full bg-base-100 shadow-xl min-h-[250px]">
            <h1 className="text-center pt-2">Active</h1>
            <div className="grid grid-cols-3 gap-4 items-stretch">
              {devEscrows.data?.map((work) => {
                return (
                  <div
                    key={work.publicKey.toString()}
                    className="card-body w-80 card bg-base-100 shadow-xl m-auto"
                  >
                    <h2 className="text-center font-bold">Upload</h2>
                    <p>Amount: {work.account.initializerAmount.toString()}</p>
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
