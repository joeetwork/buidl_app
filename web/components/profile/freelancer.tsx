'use client';

import { useDevAccounts } from '@/hooks/get-accounts';
import React, { useState } from 'react';
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

export default function Freelancer() {
  const { devEscrows } = useDevAccounts();
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
    <div className="grid grid-cols-3 gap-4 items-stretch">
      {devEscrows.data?.map((escrow) => {
        return (
          <div
            key={escrow.publicKey.toString()}
            className="card w-52 bg-base-100 shadow-xl p-4 rounded-md m-auto"
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title">Brief:</h2>

              <p>Status: {escrow.account.status}</p>

              <div
                className="tooltip before:max-w-none"
                data-tip={escrow.account.initializer.toString()}
              >
                <p>
                  Pubkey: {ellipsify(escrow.account.initializer.toString())}
                </p>
              </div>

              <p>Amount: {escrow.account.initializerAmount.toString()}</p>

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
                    {ellipsify(escrow.account.verifiedCollection.toString())}
                  </p>
                </div>
              ) : null}
              <p className="w-full break-words">{escrow.account.about}</p>
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
                      value={link}
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
  );
}
