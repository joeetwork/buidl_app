'use client';
import { useValidateCollection } from '@/hooks/validate';
import React from 'react';
import { ellipsify } from '../shared/ellipsify';
import { PublicKey } from '@solana/web3.js';

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
        {validatorCollectionEscrows.data?.map((escrow) => {
          return (
            <div
              key={escrow.publicKey.toString()}
              className="card w-96 bg-base-300 shadow-xl m-auto"
              onClick={() => handleChange(escrow.publicKey)}
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
