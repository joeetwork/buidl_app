'use client';

import { useClientAccounts } from '@/hooks/get-accounts';
import React from 'react';
import { ellipsify } from '../shared/ellipsify';
import { useValidateClient } from '@/hooks/validate';
import { useCancel } from '@/hooks/cancel';
import { PublicKey } from '@solana/web3.js';

export default function Client() {
  const { clientEscrows } = useClientAccounts();
  const { validateWithClient } = useValidateClient();
  const { cancel } = useCancel();

  const handleAcceptClick = (escrow: PublicKey) => {
    validateWithClient.mutateAsync(escrow);
  };

  const handleCancelClick = (escrow: PublicKey) => {
    cancel.mutateAsync(escrow);
  };

  return (
    <div className="grid grid-cols-3 gap-4 items-stretch">
      {clientEscrows.data?.map((escrow) => {
        return (
          <div
            key={escrow.publicKey.toString()}
            className="w-52 bg-base-100 shadow-xl p-4 rounded-md m-auto"
          >
            <div>
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
  );
}
