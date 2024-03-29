'use client';

import React, { useEffect } from 'react';
import { AppModal } from '../shared/app-modal';
import { ellipsify } from '../shared/ellipsify';
import { useValidate } from '@/hooks/validate';
import { PublicKey } from '@solana/web3.js';

interface ValidatorModalProps {
  show: boolean;
  hideModal: () => void;
}

export default function ValidatorModal({
  show,
  hideModal,
}: ValidatorModalProps) {
  const {
    acceptWithUser,
    declineWithUser,
    validatorUserEscrows,
  } = useValidate();

  const handleAcceptClick = (escrow: PublicKey) => {
    acceptWithUser.mutateAsync({
      escrow,
    });
  };

  const handleDeclineClick = (escrow: PublicKey) => {
    declineWithUser.mutateAsync({
      escrow,
    });
  };

  useEffect(() => {
    hideModal();
  }, [acceptWithUser.isSuccess, declineWithUser.isSuccess, hideModal]);

  return (
    <AppModal title={`Work to Validate`} show={show} hide={hideModal}>
      {validatorUserEscrows.data?.map((escrow) => {
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
                    escrow.account.status !== 'validate'
                  }
                >
                  Accept Work
                </button>

                <button
                  onClick={() => handleDeclineClick(escrow.publicKey)}
                  className="btn btn-primary"
                  disabled={
                    escrow.account.status !== 'validate'
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
