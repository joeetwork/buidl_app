'use client';

import { useExchange } from '@/hooks/exchange';
import { useAccounts } from '@/hooks/get-accounts';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import Input from '../shared/input';
import { useUpload } from '@/hooks/upload';
import { useDeclineRequest } from '@/hooks/declineRequest';

interface EscrowProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

const STATUS = [
  'request',
  'upload',
  'validate',
  'exchange',
  'success',
];

export default function DevUi() {
  const { userRequests } = useAccounts();
  const { exchange } = useExchange();
  const { uploadWork } = useUpload();
  const [link, setLink] = useState('');
  const [status, setStatus] = useState('exchange');

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

  const { declineRequest } = useDeclineRequest();

  const handleRequest = (data: EscrowProps) => {
    declineRequest.mutateAsync(data);
  };

  return (
    <div className="flex">
      {userRequests.data?.map((escrow) => {
        return (
          <div className="card w-72 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">{escrow.account.about}</h2>
              <p>Status: {status}</p>
              <div className="card-actions">
                {status === 'request' ? (
                  <div className="flex gap-4">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleRequest({
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
                        handleRequest({
                          escrow: escrow.publicKey,
                          initializer: escrow.account.initializer,
                        })
                      }
                    >
                      decline
                    </button>
                  </div>
                ) : null}

                {status === 'exchange' ? (
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

                {status === 'upload' ? (
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
