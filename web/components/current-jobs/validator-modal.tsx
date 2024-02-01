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
  const { validate, validatorEscrows } = useValidate(selectedCollection);
  const { collection } = useCollection(selectedCollection);

  const handleClick = (escrow: PublicKey) => {
    if (collection.result && collection?.result?.items?.length >= 1) {
      validate.mutateAsync({
        escrow,
        nftAddress: new PublicKey(collection?.result?.items[0]?.id),
      });
    }
  };

  useEffect(() => {
    hideModal();
  }, [validate.isSuccess]);

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
              <h2 className="card-title">{ellipsify(escrow.account.about)}</h2>
              <p>Status: {escrow.account.status}</p>
              <p>Pubkey: {ellipsify(escrow.publicKey.toString())}</p>
              <div className="py-8">
                <button
                  onClick={() => window.open(escrow.account.uploadWork)}
                  className={'btn btn-primary'}
                  disabled={!escrow.account.uploadWork}
                >
                  Check Uploaded work
                </button>
              </div>
              <div className="card-actions">
                <button
                  onClick={() => handleClick(escrow.publicKey)}
                  className="btn btn-primary"
                  disabled={
                    escrow.account.status !== 'validate' || !collection?.result
                  }
                >
                  Validate Work
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </AppModal>
  );
}
