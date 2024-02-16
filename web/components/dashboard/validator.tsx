'use client';

import { useValidate } from '@/hooks/validate';
import React from 'react';
import { ellipsify } from '../shared/ellipsify';
import { PublicKey } from '@solana/web3.js';

export default function Validator() {
  const { acceptWithUser, declineWithUser, validatorUserEscrows } =
    useValidate();

  const handleAcceptClick = (escrow: PublicKey) => {
    acceptWithUser.mutateAsync({
      escrow,
    });
  };

  const handleDeclineClick = (escrow: PublicKey) => {
    declineWithUser.mutateAsync({
      escrow,
    });
  };

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
          {validatorUserEscrows.data?.map((escrow) => {
            return (
              <div
                key={escrow.publicKey.toString()}
                className="card w-96 bg-base-300 shadow-xl m-auto"
              >
                <figure className="px-10 pt-10"></figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">Validate</h2>
                  <p>Status: {escrow.account.status}</p>
                  <p>Pubkey: {ellipsify(escrow.publicKey.toString())}</p>
                  <p className="w-full break-words">
                    About: {ellipsify(escrow.account.about)}
                  </p>
                  <div className="py-8">
                    <button
                      onClick={() => window.open(escrow.account.uploadWork)}
                      className={'btn btn-primary'}
                      disabled={!escrow.account.uploadWork}
                    >
                      Check Uploaded work
                    </button>
                  </div>
                  <div className="card-actions flex">
                    <button
                      onClick={() => handleAcceptClick(escrow.publicKey)}
                      className="btn btn-primary"
                      disabled={escrow.account.status !== 'validate'}
                    >
                      Accept Work
                    </button>

                    <button
                      onClick={() => handleDeclineClick(escrow.publicKey)}
                      className="btn btn-primary"
                      disabled={escrow.account.status !== 'validate'}
                    >
                      Decline Work
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
