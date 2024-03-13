'use client';

import { useValidateCollection } from '@/hooks/validate';
import { PublicKey } from '@solana/web3.js';
import React from 'react';

interface VoteActionsProps {
  contract: PublicKey | null;
  collection: PublicKey | null;
}

export default function VoteActions({
  collection,
  contract,
}: VoteActionsProps) {
  const {
    acceptWithCollection,
    declineWithCollection,
    validatorCollectionEscrow,
    collections,
  } = useValidateCollection({ collection, contract });

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
    <div className="flex w-full justify-between">
      <button
        onClick={() => handleAcceptClick()}
        className="btn btn-primary w-[49%]"
        disabled={
          validatorCollectionEscrow.data?.status !== 'validate' ||
          collections?.result.items.length < 1 ||
          validatorCollectionEscrow.isPending
        }
      >
        Accept Work
      </button>

      <button
        onClick={() => handleDeclineClick()}
        className="btn btn-primary w-[49%]"
        disabled={
          validatorCollectionEscrow.data?.status !== 'validate' ||
          collections?.result.items.length < 1 ||
          validatorCollectionEscrow.isPending
        }
      >
        Decline Work
      </button>
    </div>
  );
}
