'use client';

import { useAccounts } from '@/hooks/get-accounts';
import { useValidate } from '@/hooks/validate';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import { COLLECTIONS, ROLES } from '@/constants';
import { useCollection } from '@/hooks/get-collection';

export default function ValidatorUi() {
  const { validate } = useValidate();
  const [selectedCollection, setSelectedCollection] = useState<PublicKey>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey>();
  // const { publicKey } = useWallet();
  const { validatorEscrows } = useAccounts();
  const { collection } = useCollection(selectedCollection);

  const handleCollectionClick = (collection: PublicKey) => {
    setSelectedCollection(collection);
    validatorEscrows.mutateAsync(collection);
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
                onClick={() => handleEscrowClick(escrow.publicKey)}
              >
                <div>{escrow.publicKey.toString()}</div>
                <div>Validate this work</div>
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
