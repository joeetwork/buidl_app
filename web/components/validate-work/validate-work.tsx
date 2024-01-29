'use client';


import { useAccounts } from '@/hooks/get-accounts';
import { useValidate } from '@/hooks/validate';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Exchange from '../exchange/exchange';
import UploadWork from '../upload-work/upload-work';
import { COLLECTIONS } from '@/constants';

export default function ValidateWork() {
  const { validate } = useValidate();
  const [selectedCollection, setSelectedCollection] = useState<PublicKey>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey>();
  const { publicKey } = useWallet();
  const { validatorEscrows } = useAccounts();

  const handleCollectionClick = (collection: PublicKey) => {
    setSelectedCollection(collection);
    validatorEscrows.mutateAsync(collection);
  };

  const handleEscrowClick = (escrow: PublicKey) => {
    setSelectedEscrow(escrow);
  };

  //display the collections here

  //once clicked display the escrows/work that can be validated

  //check if the user has an nft related to that collection

  const { data } = useQuery({
    queryKey: ['test', selectedCollection],
    queryFn: async () => {
      const res = await fetch('/api/search-assets', {
        method: 'POST',
        body: JSON.stringify({
          ownerAddress: publicKey?.toString(),
          grouping: ['collection', selectedCollection?.toString()],
        }),
      });
      const data = res.json();
      return data;
    },
  });

  //if true enable submit button and submit the nft id and the collection id when validates

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
              <div key={escrow.publicKey.toString()}>
                <div>{escrow.publicKey.toString()}</div>
                <div onClick={() => handleEscrowClick(escrow.publicKey)}>
                  Validate this work
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <Exchange />
      <button
        className="btn btn-xs btn-secondary btn-outline"
        onClick={() => {
          if (selectedEscrow && data?.result?.items[0]) {
            return validate.mutateAsync({
              escrow: selectedEscrow,
              nftAddress: new PublicKey(data?.result?.items[0].id),
            });
          }
        }}
        disabled={
          validate.isPending || !data?.result?.items[0] || !selectedEscrow
        }
      >
        Validate
      </button>
      <UploadWork />
    </>
  );
}
