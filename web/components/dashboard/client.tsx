'use client';

import { useClientAccounts } from '@/hooks/get-accounts';
import React, { useState } from 'react';
import HistoryModal from './history-modal';
import { ellipsify } from '../shared/ellipsify';
import { useValidateClient } from '@/hooks/validate';
import { useCancel } from '@/hooks/cancel';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

interface ClientProps {
  account: anchor.IdlAccounts<AnchorEscrow>['upload'];
  publicKey: PublicKey;
}

export default function Client() {
  const [showModal, setShowModal] = useState(false);
  const { clientEscrows, uploadClientHistory } = useClientAccounts();
  const { validateWithClient } = useValidateClient();
  const { cancel } = useCancel();

  const handleAcceptClick = (escrow: PublicKey) => {
    validateWithClient.mutateAsync(escrow);
  };

  const handleCancelClick = (escrow: PublicKey) => {
    cancel.mutateAsync(escrow);
  };

  return (
    <>
      <div className="flex justify-between gap-4">
        <div className="card w-full bg-base-100 shadow-xl h-56">
          <h1 className="text-center pt-2">Stats</h1>
          <p className="text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </p>
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
            uploadHistory={uploadClientHistory?.data as ClientProps[]}
            hideModal={() => setShowModal(false)}
            show={showModal}
          />
        </div>
      </div>

      <div className="flex card w-full bg-base-100 shadow-xl min-h-[250px]">
        <h1 className="text-center pt-2">Active</h1>
        <div className="grid grid-cols-3 gap-4 items-stretch">
          {clientEscrows.data?.map((escrow) => {
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
                  {escrow.account.status === 'request' ||
                  escrow.account.status === 'close' ? (
                    <div className="card-actions justify-end">
                      <button
                        onClick={() => handleCancelClick(escrow.publicKey)}
                        className="btn btn-primary"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}

                  {escrow.account.status === 'validate' ? (
                    <div className="card-actions justify-end">
                      <button
                        onClick={() => window.open(escrow.account.uploadWork)}
                        className={'btn btn-primary'}
                        disabled={!escrow.account.uploadWork}
                      >
                        Check Uploaded work
                      </button>
                      <button
                        onClick={() => handleAcceptClick(escrow.publicKey)}
                        className="btn btn-primary"
                      >
                        Validate
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
