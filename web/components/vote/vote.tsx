'use client';
import React, { useCallback, useState } from 'react';
import { useInitialiseEscrow } from '@/hooks/initialize-escrow';
import { PublicKey } from '@solana/web3.js';
import VoteModal from './vote-modal';

import VoteValidator from './vote-validator';
import VoteWork from './vote-work';
import VoteInfo from './vote-info';
import { useValidateCollection } from '@/hooks/validate';

export default function Vote() {
  const { initializeEscrow } = useInitialiseEscrow();
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCollection, setShowCollection] = useState(true);
  const [contract, setContract] = useState<PublicKey | null>(null);
  const { acceptWithCollection, declineWithCollection } =
    useValidateCollection(contract);

  const handleModalClick = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

  const handleAcceptClick = () => {
    if (contract && collection) {
      acceptWithCollection.mutateAsync({
        escrow: contract,
        nftAddress: collection,
      });
    }
  };

  const handleDeclineClick = () => {
    if (contract && collection) {
      declineWithCollection.mutateAsync({
        escrow: collection,
        nftAddress: contract,
      });
    }
  };

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

              <div className="card-actions flex w-full">
                <button
                  onClick={() => handleAcceptClick()}
                  className="btn btn-primary w-[49%]"
                  // disabled={
                  //   escrow.account.status !== 'validate' ||
                  //   collection?.result.items.length < 1 ||
                  //   isPending
                  // }
                >
                  Accept Work
                </button>

                <button
                  onClick={() => handleDeclineClick()}
                  className="btn btn-primary w-[49%]"
                  // disabled={
                  //   escrow.account.status !== 'validate' ||
                  //   collection?.result.items.length < 1 ||
                  //   isPending
                  // }
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
