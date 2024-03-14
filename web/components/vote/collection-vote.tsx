'use client';

import React, { useState } from 'react';
import VoteInfo from './vote-info';
import VoteActions from './vote-actions';
import VoteContracts from './vote-contracts';
import VoteSelect from './vote-select';
import { PublicKey } from '@solana/web3.js';
import { useValidateCollection } from '@/hooks/validate';

export default function CollectionVote() {
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [contract, setContract] = useState<PublicKey | null>(null);
  const {
    validatorCollectionEscrows,
    validatorCollectionEscrow,
    collections,
    acceptWithCollection,
    declineWithCollection,
  } = useValidateCollection({
    collection,
    contract,
  });

  const handleAcceptClick = () => {
    if (
      contract &&
      collections.result &&
      collections?.result?.items?.length >= 1
    ) {
      acceptWithCollection.mutateAsync({
        escrow: contract,
        nftAddress: new PublicKey(collections?.result?.items[0]?.id),
      });
    }
  };

  const handleDeclineClick = () => {
    if (
      contract &&
      collections.result &&
      collections?.result?.items?.length >= 1
    ) {
      declineWithCollection.mutateAsync({
        escrow: contract,
        nftAddress: new PublicKey(collections?.result?.items[0]?.id),
      });
    }
  };

  return (
    <>
      <VoteSelect onChange={setCollection} collection={collection} />

      <VoteContracts
        escrows={validatorCollectionEscrows.data}
        onClick={(e) => setContract(e)}
      />

      <VoteInfo escrow={validatorCollectionEscrow.data} />

      <VoteActions
        onAcceptClick={handleAcceptClick}
        onDeclineClick={handleDeclineClick}
        collections={collections}
        escrow={validatorCollectionEscrow.data}
        isPending={validatorCollectionEscrow.isPending}
      />
    </>
  );
}
