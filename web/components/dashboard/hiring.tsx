'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React, { useState } from 'react';
import HistoryModal from './history-modal';

export default function Hiring() {
  const [showModal, setShowModal] = useState(false);
  const { hiringEscrows, uploadEmployerHistory } = useAccounts();

  return (
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
            uploadHistory={uploadEmployerHistory?.data}
            hideModal={() => setShowModal(false)}
            show={showModal}
          />
        </div>
      </div>

      <div className="flex card w-full bg-base-100 shadow-xl min-h-[250px]">
        <h1 className="text-center pt-2">Active</h1>
        <div className="grid grid-cols-3 gap-4 items-stretch">
          {hiringEscrows.data?.map((work) => {
            return (
              <div
                key={work.publicKey.toString()}
                className="card w-80 bg-base-100 shadow-xl m-auto"
              >
                <div className="card-body">
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
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
