'use client';
import { useValidateCollection } from '@/hooks/validate';
import React from 'react';
import { PublicKey } from '@solana/web3.js';
import { ellipsify } from '../shared/ellipsify';

interface VoteWorkProps {
  selectedCollection: PublicKey | null;
  onChange: (e: PublicKey) => void;
}

export default function VoteWork({
  selectedCollection,
  onChange,
}: VoteWorkProps) {
  const { validatorCollectionEscrows } =
    useValidateCollection(selectedCollection);

  const handleChange = (pubkey: PublicKey) => {
    onChange(pubkey);
  };

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
                onClick={() => handleChange(escrow.publicKey)}
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
