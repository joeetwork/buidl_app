'use client';

import { COLLECTIONS } from '@/constants/verified-collections';
import { useAccounts } from '@/instructions/get-accounts';
import { useValidate } from '@/instructions/validate';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

export default function ValidateWork() {
  const { validate } = useValidate();
  const [selectedCollection, setSelectedCollection] = useState<
    PublicKey | undefined
  >();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey | undefined>();

  const {publicKey} = useWallet();

  const { validatorEscrows } = useAccounts();

  const handleCollectionClick = (collection: PublicKey) => {
    setSelectedCollection(collection);
    validatorEscrows.mutateAsync({ collection });
  };

  const handleEscrowClick = (escrow: PublicKey) => {
    setSelectedEscrow(escrow);
  };

  //display the collections here

  //once clicked display the escrows/work that can be validated

  //check if the user has an nft related to that collection

  const { data, isLoading } = useQuery({
    queryKey: ['test', selectedCollection],
    queryFn: async () => {
      const res = await fetch('/api/assets-by-group', {
        method: 'POST',
        body: JSON.stringify({
          groupValue: selectedCollection?.toString(),
        }),
      });
      const data = res.json();
      return data;
    },
  });

  const data2 = useQuery({
    queryKey: ['test', publicKey],
    queryFn: async () => {
      const res = await fetch('/api/assets-by-owner', {
        method: 'POST',
        body: JSON.stringify({
            ownerAddress: publicKey?.toString(),
        }),
      });
      const data = res.json();
      return data;
    },
  });
  

  useEffect(() => {    
    console.log(data2.data, data2.isLoading);
  }, [data2.data, data2.isLoading]);

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
          {validatorEscrows.data?.map((escrow, i) => {
            return (
              <>
                <div key={i}>{escrow.publicKey.toString()}</div>
                <div onClick={() => handleEscrowClick(escrow.publicKey)}>
                  Validate this work
                </div>
              </>
            );
          })}
        </div>
      ) : null}

      <button
        className="btn btn-xs btn-secondary btn-outline"
        onClick={() => {
            if (selectedEscrow) {
              return validate.mutateAsync({
                escrow: selectedEscrow,
                nftAddress: '',
              });
            }
        }}
        disabled={validate.isPending}
      >
        Validate
      </button>
    </>
  );
}
