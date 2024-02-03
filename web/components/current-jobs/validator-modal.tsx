'use client';

import React, { useEffect } from 'react';
import { AppModal } from '../shared/app-modal';
import { ellipsify } from '../shared/ellipsify';
import { useValidate } from '@/hooks/validate';
import { useCollection } from '@/hooks/get-collection';
import { PublicKey } from '@solana/web3.js';

interface ValidatorModalProps {
  show: boolean;
  selectedCollection?: PublicKey;
  hideModal: () => void;
}

export default function ValidatorModal({
  show,
  selectedCollection,
  hideModal,
}: ValidatorModalProps) {
  const { validateAccept, validateDecline, validatorEscrows } =
    useValidate(selectedCollection);
  const { collection, isPending } = useCollection(selectedCollection);

  const handleAcceptClick = (escrow: PublicKey) => {
    if (collection.result && collection?.result?.items?.length >= 1) {
      validateAccept.mutateAsync({
        escrow,
        nftAddress: new PublicKey(collection?.result?.items[0]?.id),
      });
    }
  };

  const handleDeclineClick = (escrow: PublicKey) => {
    if (collection.result && collection?.result?.items?.length >= 1) {
      validateDecline.mutateAsync({
        escrow,
        nftAddress: new PublicKey(collection?.result?.items[0]?.id),
      });
    }
  };

  useEffect(() => {
    hideModal();
  }, [validateAccept.isSuccess, validateDecline.isSuccess, hideModal]);

  return (
    <AppModal title={`Work to Validate`} show={show} hide={hideModal}>
      {validatorEscrows.data?.map((escrow) => {
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
