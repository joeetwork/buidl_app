'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React, { useState } from 'react';
import { AppHero } from '../shared/app-hero';
import CreateUser from '../user/create-user';
import HistoryModal from './history-modal';
import Input from '../shared/input';
import { ellipsify } from '../shared/ellipsify';
import { PublicKey } from '@solana/web3.js';
import { useExchange } from '@/hooks/exchange';
import { useUpload } from '@/hooks/upload';
import { useRequests } from '@/hooks/requests';

interface EscrowProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

export default function Dev() {
  const [showModal, setShowModal] = useState(false);
  const { uploadDevHistory, devEscrows, userAccount } = useAccounts();
  const { exchange } = useExchange();
  const { uploadWork } = useUpload();
  const { declineRequest, acceptRequest } = useRequests();
  const [link, setLink] = useState('');

  const handleExchange = (data: EscrowProps) => {
    exchange.mutateAsync(data);
  };

  const handleUpload = (data: EscrowProps) => {
    if (link) {
      uploadWork.mutateAsync({
        escrow: data.escrow,
        initializer: data?.initializer,
        link,
      });
    }
  };

  const handleDecline = (data: EscrowProps) => {
    declineRequest.mutateAsync(data);
  };

  const handleAccept = (data: EscrowProps) => {
    acceptRequest.mutateAsync(data);
  };

  return (
    <>
      {userAccount.data ? (
        <>
          <div className="flex justify-between gap-4">
            <div className="card w-full bg-base-100 shadow-xl h-56">
              <h1 className="text-center pt-2">Stats</h1>
              <p className="text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="card w-full bg-base-100 shadow-xl h-56">
              <h1 className="text-center pt-2">History</h1>
              <button
                className="btn btn-primary w-1/4 m-auto"
                onClick={() => setShowModal(true)}
              >
                Show History
              </button>
              <HistoryModal
                uploadHistory={uploadDevHistory?.data}
                hideModal={() => setShowModal(false)}
                show={showModal}
              />
            </div>
          </div>

          <div className="flex card w-full bg-base-100 shadow-xl min-h-[250px]">
            <h1 className="text-center pt-2">Active</h1>
            <div className="grid grid-cols-3 gap-4 items-stretch">
              {devEscrows.data?.map((escrow) => {
                return (
                  <div
                    key={escrow.publicKey.toString()}
                    className="card w-72 bg-base-100 shadow-xl m-auto"
                  >
                    <div className="card-body items-center text-center">
                      <h2 className="card-title">Brief:</h2>

                      <p>Status: {escrow.account.status}</p>

                      <div
                        className="tooltip before:max-w-none"
                        data-tip={escrow.account.initializer.toString()}
                      >
                        <p>
                          Pubkey:{' '}
                          {ellipsify(escrow.account.initializer.toString())}
                        </p>
                      </div>

                      <p>
                        Amount: {escrow.account.initializerAmount.toString()}
                      </p>

                      <p>Validator Vote: {escrow.account.validatorCount}</p>
                      {escrow.account.validator ? (
                        <div
                          className="tooltip before:max-w-none"
                          data-tip={escrow.account.validator.toString()}
                        >
                          <p>
                            Collection id:{' '}
                            {ellipsify(escrow.account.validator.toString())}
                          </p>
                        </div>
                      ) : null}

                      {escrow.account.verifiedCollection ? (
                        <div
                          className="tooltip before:max-w-none"
                          data-tip={escrow.account.verifiedCollection.toString()}
                        >
                          <p>
                            Collection id:{' '}
                            {ellipsify(
                              escrow.account.verifiedCollection.toString()
                            )}
                          </p>
                        </div>
                      ) : null}
                      <p className="w-full break-words">
                        {escrow.account.about}
                      </p>
                      <div className="card-actions">
                        {escrow.account.status === 'request' ? (
                          <div className="flex gap-4">
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                handleAccept({
                                  escrow: escrow.publicKey,
                                  initializer: escrow.account.initializer,
                                })
                              }
                            >
                              accept
                            </button>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                handleDecline({
                                  escrow: escrow.publicKey,
                                  initializer: escrow.account.initializer,
                                })
                              }
                            >
                              decline
                            </button>
                          </div>
                        ) : null}

                        {escrow.account.status === 'exchange' ? (
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              handleExchange({
                                escrow: escrow.publicKey,
                                initializer: escrow.account.initializer,
                              })
                            }
                            disabled={exchange.isPending}
                          >
                            Exchange
                          </button>
                        ) : null}

                        {escrow.account.status === 'upload' ? (
                          <div>
                            <Input
                              label="Upload work"
                              onChange={(e) => setLink(e.target.value)}
                            />

                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                handleUpload({
                                  escrow: escrow.publicKey,
                                  initializer: escrow.account.initializer,
                                })
                              }
                              disabled={uploadWork.isPending}
                            >
                              Upload Work
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <AppHero title={'Looking for a gig?'} subtitle={'Sign up below!'}>
          <CreateUser />
        </AppHero>
      )}
    </>
  );
}
