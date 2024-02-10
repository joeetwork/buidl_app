'use client';

import React, { useEffect } from 'react';
import { AppModal } from '../shared/app-modal';
import { ellipsify } from '../shared/ellipsify';
import { useValidate } from '@/hooks/validate';
import { useCollection } from '@/hooks/get-collection';
import { PublicKey } from '@solana/web3.js';

interface CollectionModalProps {
  show: boolean;
  selectedCollection?: PublicKey;
  hideModal: () => void;
}

export default function CollectionModal({
  show,
  selectedCollection,
  hideModal,
}: CollectionModalProps) {
  const {
    acceptWithCollection,
    declineWithCollection,
    validatorCollectionEscrows,
    countVote,
  } = useValidate(selectedCollection);
  const { collection, isPending } = useCollection(selectedCollection);

  const handleAcceptClick = (escrow: PublicKey) => {
    if (collection.result && collection?.result?.items?.length >= 1) {
      acceptWithCollection.mutateAsync({
        escrow,
        nftAddress: new PublicKey(collection?.result?.items[0]?.id),
      });
    }
  };

  const handleDeclineClick = (escrow: PublicKey) => {
    if (collection.result && collection?.result?.items?.length >= 1) {
      declineWithCollection.mutateAsync({
        escrow,
        nftAddress: new PublicKey(collection?.result?.items[0]?.id),
      });
    }
  };

  useEffect(() => {
    hideModal();
  }, [
    acceptWithCollection.isSuccess,
    declineWithCollection.isSuccess,
    hideModal,
  ]);

  return (
    <AppModal title={`Work to Validate`} show={show} hide={hideModal}>
      {validatorCollectionEscrows.data?.map((escrow) => {

        console.log(escrow.account.voteDeadline &&
          escrow.account.voteDeadline.toNumber() < (new Date().getTime() / 1000));
        
        
        if (
          escrow.account.status === 'validate' &&
          escrow.account.voteDeadline &&
          escrow.account.voteDeadline.toNumber() < (new Date().getTime() / 1000)
        ) {
          countVote.mutateAsync(escrow.publicKey);
        }

        return (
          <div
            key={escrow.publicKey.toString()}
            className="card w-96 bg-base-300 shadow-xl m-auto"
          >
            <figure className="px-10 pt-10"></figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Validate</h2>
              <p>Status: {escrow.account.status}</p>
              <p>Pubkey: {ellipsify(escrow.publicKey.toString())}</p>
              <p className="w-full break-words">
                About: {ellipsify(escrow.account.about)}
              </p>
              <div className="py-8">
                <button
                  onClick={() => window.open(escrow.account.uploadWork)}
                  className={'btn btn-primary'}
                  disabled={!escrow.account.uploadWork}
                >
                  Check Uploaded work
                </button>
              </div>
              <div className="card-actions flex">
                <button
                  onClick={() => handleAcceptClick(escrow.publicKey)}
                  className="btn btn-primary"
                  disabled={
                    escrow.account.status !== 'validate' ||
                    collection?.result.items.length < 1 ||
                    isPending
                  }
                >
                  Accept Work
                </button>

                <button
                  onClick={() => handleDeclineClick(escrow.publicKey)}
                  className="btn btn-primary"
                  disabled={
                    escrow.account.status !== 'validate' ||
                    collection?.result.items.length < 1 ||
                    isPending
                  }
                >
                  Decline Work
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </AppModal>
  );
}
