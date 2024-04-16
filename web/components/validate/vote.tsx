'use client';
import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useValidateCollection, useValidateUser } from '@/hooks/validate';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';
import EscrowsDisplay from '../shared/escrow-display';
import ValidateActions from './validate-actions';
import SelectCollection from '../shared/select-collection.tsx';

type Escrow =
  | {
      account: anchor.IdlAccounts<AnchorEscrow>['escrow'];
      publicKey: PublicKey;
    }
  | null
  | undefined;

function UserVote() {
  const [userEscrow, setUserEscrow] = useState<number>(-1);
  const { userEscrows, acceptWithUser, declineWithUser } = useValidateUser();

  const escrow = userEscrows.data?.filter(
    (escrow) => escrow.account.status === 'validate'
  );

  const handleAcceptClick = () => {
    if (escrow && escrow[userEscrow]) {
      acceptWithUser.mutateAsync({
        escrow: escrow[userEscrow]?.publicKey,
      });
    }
  };

  const handleDeclineClick = () => {
    if (escrow && escrow[userEscrow]) {
      declineWithUser.mutateAsync({
        escrow: escrow[userEscrow]?.publicKey,
      });
    }
  };

  return (
    <>
      <EscrowsDisplay
        escrows={userEscrows.data?.filter(
          (escrow) => escrow.account.status === 'validate'
        )}
        escrow={escrow && escrow[userEscrow]?.account}
        onClick={(e, i) => setUserEscrow(i)}
      />

      <ValidateActions
        onAcceptClick={handleAcceptClick}
        onDeclineClick={handleDeclineClick}
        escrow={escrow && escrow[userEscrow]?.account}
        isPending={acceptWithUser.isPending || declineWithUser.isPending}
      />
    </>
  );
}

function CollectionVote() {
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [collectionEscrow, setCollectionEscrow] = useState<PublicKey | null>(
    null
  );
  const [escrow, setEscrow] = useState<Escrow>();

  const {
    collectionEscrows,
    collections,
    acceptWithCollection,
    declineWithCollection,
  } = useValidateCollection(collection);

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

  useEffect(() => {
    setEscrow(
      collectionEscrows.data?.find((e) => e.publicKey === collectionEscrow)
    );
  }, [collectionEscrow, collectionEscrows.data?.length]);

  return (
    <>
      <SelectCollection
        onClick={(e) => setCollection(e)}
        collection={collection}
      />

      <EscrowsDisplay
        escrows={collectionEscrows.data}
        escrow={escrow?.account}
        onClick={(e) => setCollectionEscrow(e)}
      />

      <ValidateActions
        onAcceptClick={handleAcceptClick}
        onDeclineClick={handleDeclineClick}
        collections={collections}
        escrow={escrow?.account}
        isPending={
          acceptWithCollection.isPending || declineWithCollection.isPending
        }
      />
    </>
  );
}

export default function Vote() {
  const [showCollection, setShowCollection] = useState(false);

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
