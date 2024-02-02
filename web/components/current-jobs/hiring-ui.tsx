'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React, { useState } from 'react';
import { ellipsify } from '../shared/ellipsify';
import HiringModal from './hiring-modal';

export default function HiringUi() {
  const { hiringEscrows } = useAccounts();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div>
        <div className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            Upload History
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {hiringEscrows.data?.map((escrow) => {
            return (
              <div
                key={escrow.publicKey.toString()}
                className="card w-72 bg-base-100 shadow-xl m-auto"
              >
                <div className="card-body">
                  <h2 className="card-title m-auto">
                    Status: {escrow.account.status}
                  </h2>
                  <p>{ellipsify(escrow.publicKey.toString())}</p>
                  <p>{escrow.account.about}</p>
                  {escrow.account.status === 'request' ? (
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">Cancel</button>
                    </div>
                  ) : null}

                  {escrow.account.status === 'validate' ? (
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">Validate</button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <HiringModal show={showModal} hideModal={() => setShowModal(false)} />
    </>
  );
}
