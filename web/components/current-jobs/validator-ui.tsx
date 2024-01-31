'use client';

import { useAccounts } from '@/hooks/get-accounts';
import { useValidate } from '@/hooks/validate';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import { COLLECTIONS, ROLES } from '@/constants';
import { useCollection } from '@/hooks/get-collection';

export default function ValidatorUi() {
  const [selectedCollection, setSelectedCollection] = useState<PublicKey>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey>();
  // const { publicKey } = useWallet();
  const { validate, validatorEscrows } = useValidate(selectedCollection);
  const { collection } = useCollection(selectedCollection);

  const handleCollectionClick = (collection: PublicKey) => {
    setSelectedCollection(collection);
  };

  const handleEscrowClick = (escrow: PublicKey) => {
    setSelectedEscrow(escrow);
  };

  return (
    <>
      <div className="flex flex-col">
        <div>Verified Collection</div>
        {COLLECTIONS.map((collection, i) => {
          return (
            <div
              key={i}
              onClick={() => handleCollectionClick(new PublicKey(collection))}
              className="flex"
            >
              {collection}
            </div>
          );
        })}
      </div>

      {validatorEscrows.isSuccess ? (
        <div>
          {validatorEscrows.data?.map((escrow) => {
            return (
              <div
                key={escrow.publicKey.toString()}
                className="card w-96 bg-base-100 shadow-xl"
              >
                <figure className="px-10 pt-10">
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">{escrow.publicKey.toString()}</h2>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEscrowClick(escrow.publicKey)}
                      className="btn btn-primary"
                    >
                      Validate Work
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <button
        className="btn btn-xs btn-secondary btn-outline"
        onClick={() => {
          if (selectedEscrow && collection?.data?.result?.items[0]) {
            return validate.mutateAsync({
              escrow: selectedEscrow,
              nftAddress: new PublicKey(collection?.data?.result?.items[0].id),
            });
          }
        }}
        disabled={validate.isPending || !selectedEscrow}
      >
        Validate
      </button>
    </>
  );
}
