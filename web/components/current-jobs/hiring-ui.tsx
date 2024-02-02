'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React from 'react';
import { ellipsify } from '../shared/ellipsify';

export default function HiringUi() {
  const { hiringEscrows } = useAccounts();

  return (
    <div>
      {hiringEscrows.data?.map((escrow) => {
        return (
          <div
            key={escrow.publicKey.toString()}
            className="card w-72 bg-base-100 shadow-xl"
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
  );
}
