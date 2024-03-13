'use client';
import React, { useCallback, useState } from 'react';
import { useInitialiseEscrow } from '@/hooks/initialize-escrow';
import { PublicKey } from '@solana/web3.js';
import VoteModal from './vote-modal';

import VoteValidator from './vote-validator';
import VoteWork from './vote-work';
import VoteInfo from './vote-info';
import { useValidateCollection } from '@/hooks/validate';
import { useCollection } from '@/hooks/get-collection';
import { useProgram } from '@/hooks/get-program';
import { useQuery } from '@tanstack/react-query';

export default function Vote() {
  const { initializeEscrow } = useInitialiseEscrow();
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCollection, setShowCollection] = useState(true);
  const [contract, setContract] = useState<PublicKey | null>(null);
  const { acceptWithCollection, declineWithCollection } =
    useValidateCollection(contract);
  const { collections } = useCollection(collection);

  const handleModalClick = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

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

  const { program } = useProgram();

  const validatorCollectionEscrow = useQuery({
    queryKey: ['validatorCollectionEscrows', { contract }],
    queryFn: async () => {
      if (contract) {
        return await program.account.escrow.fetch(contract);
      }
      return null;
    },
  });

  return (
    <div className="h-full">
      {!initializeEscrow.isSuccess ? (
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

          {showCollection ? (
            <VoteValidator
              onModalChange={handleModalClick}
              collection={collection}
            />
          ) : null}

          {collection ? (
            <>
              <VoteWork
                selectedCollection={collection}
                onChange={(e) => setContract(e)}
              />

              <VoteInfo contract={contract} />

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
            </>
          ) : (
            <div
              className={`bg-gray-500 rounded-lg p-4 hover:ring hover:ring-gray-700 w-full`}
            >
              <div>No contracts to validate</div>
            </div>
          )}
        </div>
      ) : (
        <div>Congrats request sent</div>
      )}

      <VoteModal
        show={showModal}
        hideModal={handleModalClick}
        onClick={(e) => setCollection(e)}
      />
    </div>
  );
}
