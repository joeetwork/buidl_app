'use client';
import React from 'react';
import { ellipsify } from '../shared/ellipsify';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

interface EscrowsDisplayProps {
  escrows?:
    | {
        account: anchor.IdlAccounts<AnchorEscrow>['escrow'];
        publicKey: PublicKey;
      }[]
    | null;
  escrow?: anchor.IdlAccounts<AnchorEscrow>['escrow'] | null;
  onClick: (e: PublicKey, i: number) => void;
}

export default function EscrowsDisplay({
  escrows,
  escrow,
  onClick,
}: EscrowsDisplayProps) {
  const handleClick = (e: PublicKey, i: number) => {
    onClick(e, i);
  };

  const date = escrow?.voteDeadline
    ? new Date(escrow.voteDeadline.toString() * 1000).getHours()
    : 0;

  return (
    <>
      <div
        className={`bg-teal-700 rounded-lg p-4 w-full hover:ring hover:ring-teal-600`}
      >
        <div className="w-full">
          <span className="label-text cursor-default">Contracts</span>
          <div className="flex gap-4 overflow-x-scroll">
            {escrows?.map((escrow, i) => {
              return (
                <div
                  key={escrow.publicKey.toString()}
                  className="card w-40 bg-base-300 shadow-xl m-auto"
                  onClick={() => handleClick(escrow.publicKey, i)}
                >
                  <div className="card-body items-center text-center">
                    <p>{ellipsify(escrow.account.initializer.toString())}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={`bg-teal-700 rounded-lg p-4 hover:ring hover:ring-teal-600 w-full h-[210px]`}
      >
        <div className="w-full flex flex-col">
          <span className="label-text cursor-default">
            Contract Information
          </span>
        </div>
        <div className="flex justify-between">
          <div className="rounded-xl bg-teal-900 p-4 w-[49%]">{date} Hrs</div>
          <button
            onClick={() => window.open(escrow?.uploadWork)}
            className={'btn btn-primary w-[49%]'}
            disabled={escrow ? !escrow.uploadWork : true}
          >
            Check Uploaded work
          </button>
        </div>
        <div className="rounded-xl bg-teal-900 p-4 mt-2 h-[100px] overflow-y-scroll">
          {escrow?.about}
        </div>
      </div>
    </>
  );
}
