'use client';
import React from 'react';
import { ellipsify } from '../shared/ellipsify';
import { PublicKey } from '@solana/web3.js';
import { useValidateCollection } from '@/hooks/validate';

interface VoteContractsProps {
  collection: PublicKey | null;
  onClick: (e: PublicKey) => void;
}

export default function VoteContracts({
  collection,
  onClick,
}: VoteContractsProps) {
  const { validatorCollectionEscrows } = useValidateCollection({
    collection,
  });

  return (
    <div
      className={`bg-gray-500 rounded-lg p-4 w-full hover:ring hover:ring-gray-700`}
    >
      <div className="w-full">
        <span className="label-text cursor-default">Contracts</span>
        <div className="flex gap-4 overflow-x-scroll">
          {validatorCollectionEscrows.data?.map((escrow) => {
            return (
              <div
                key={escrow.publicKey.toString()}
                className="card w-40 bg-base-300 shadow-xl m-auto"
                onClick={() => onClick(escrow.publicKey)}
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
  );
}
