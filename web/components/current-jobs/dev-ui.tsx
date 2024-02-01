'use client';

import { useExchange } from '@/hooks/exchange';
import { useAccounts } from '@/hooks/get-accounts';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import Input from '../shared/input';
import { useUpload } from '@/hooks/upload';
import { useRequests } from '@/hooks/requests';

interface EscrowProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

export default function DevUi() {
  const { userRequests } = useAccounts();
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
console.log(userRequests.data);

  return (
    <div className="flex">
      {userRequests.data?.map((escrow) => {
        return (
          <div
            key={escrow.publicKey.toString()}
            className="card w-72 bg-base-100 shadow-xl"
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title">{escrow.account.about}</h2>
              <p>Status: {escrow.account.status}</p>
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
                      value={link}
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
