'use client';

import { useExchange } from '@/hooks/exchange';
import { useAccounts } from '@/hooks/get-accounts';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import Input from '../shared/input';
import { useUpload } from '@/hooks/upload';

interface EscrowProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

const STATUS = [
  'offer',
  'accepted',
  'declined',
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

  return (
    <div className="flex">
      {userRequests.data?.map((escrow) => {
        return (
          <div className="card w-72 bg-base-100 shadow-xl">
            <figure className="px-5 pt-5">
              <img
                src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                alt="Shoes"
                className="rounded-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{escrow.account.about}</h2>
              <p>Status: {status}</p>
              <div className="card-actions">
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
