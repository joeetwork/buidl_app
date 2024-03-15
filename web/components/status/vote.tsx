'use client';
import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useValidateCollection, useValidateUser } from '@/hooks/validate';
import EscrowInfo from './escrow-info';
import EscrowsDisplay from './escrow-display';
import EscrowActions from './escrow-actions';
import SelectCollection from './select-collection.tsx';

function UserVote() {
  const [userEscrow, setUserEscrow] = useState<PublicKey | null>(null);
  const {
    validatorUserEscrows,
    validatorUserEscrow,
    acceptWithUser,
    declineWithUser,
  } = useValidateUser(userEscrow);

  const handleAcceptClick = () => {
    if (userEscrow) {
      acceptWithUser.mutateAsync({
        escrow: userEscrow,
      });
    }
  };

  const handleDeclineClick = () => {
    if (userEscrow) {
      declineWithUser.mutateAsync({
        escrow: userEscrow,
      });
    }
  };

  return (
    <>
      <EscrowsDisplay
        escrows={validatorUserEscrows.data?.filter(
          (escrow) => escrow.account.status === 'validate'
        )}
        onClick={(e) => setUserEscrow(e)}
      />

      <EscrowInfo escrow={validatorUserEscrow.data} />

      <EscrowActions
        onAcceptClick={handleAcceptClick}
        onDeclineClick={handleDeclineClick}
        escrow={validatorUserEscrow.data}
        isPending={validatorUserEscrow.isPending}
      />
    </>
  );
}

function CollectionVote() {
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [collectionEscrow, setCollectionEscrow] = useState<PublicKey | null>(
    null
  );
  const {
    validatorCollectionEscrows,
    validatorCollectionEscrow,
    collections,
    acceptWithCollection,
    declineWithCollection,
  } = useValidateCollection({
    collection,
    escrow: collectionEscrow,
  });

  const handleAcceptClick = () => {
    if (
      collectionEscrow &&
      collections.result &&
      collections?.result?.items?.length >= 1
    ) {
      acceptWithCollection.mutateAsync({
        escrow: collectionEscrow,
        nftAddress: new PublicKey(collections?.result?.items[0]?.id),
      });
    }
  };

  const handleDeclineClick = () => {
    if (
      collectionEscrow &&
      collections.result &&
      collections?.result?.items?.length >= 1
    ) {
      declineWithCollection.mutateAsync({
        escrow: collectionEscrow,
        nftAddress: new PublicKey(collections?.result?.items[0]?.id),
      });
    }
  };

  return (
    <>
      <SelectCollection
        onClick={(e) => setCollection(e)}
        collection={collection}
      />

      <EscrowsDisplay
        escrows={validatorCollectionEscrows.data?.filter(
          (escrow) => escrow.account.status === 'validate'
        )}
        onClick={(e) => setCollectionEscrow(e)}
      />

      <EscrowInfo escrow={validatorCollectionEscrow.data} />

      <EscrowActions
        onAcceptClick={handleAcceptClick}
        onDeclineClick={handleDeclineClick}
        collections={collections}
        escrow={validatorCollectionEscrow.data}
        isPending={validatorCollectionEscrow.isPending}
      />
    </>
  );
}

export default function Vote() {
  const [showCollection, setShowCollection] = useState(true);

  return (
    <div className="h-full">
      <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
        <div className="flex justify-between w-full">
          <h3 className="font-bold text-lg">Validate work</h3>

          <div className="flex">
            <span className="pr-2">
              {showCollection ? 'Collection' : 'User'}
            </span>
            <input
              type="checkbox"
              className="toggle"
              checked={showCollection}
              onChange={() => setShowCollection(!showCollection)}
            />
          </div>
        </div>
        {showCollection ? <CollectionVote /> : <UserVote />}
      </div>
    </div>
  );
}
