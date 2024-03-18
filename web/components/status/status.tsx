'use client';
import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';
import EscrowsDisplay from '../shared/escrow-display';
import {
  useAccounts,
  useClientAccounts,
  useDevAccounts,
} from '@/hooks/get-accounts';
import { useValidateClient } from '@/hooks/validate';
import { useCancel } from '@/hooks/cancel';
import { useExchange } from '@/hooks/exchange';
import { useUpload } from '@/hooks/upload';
import { useRequests } from '@/hooks/requests';
import Input from '../shared/input';

function Client() {
  const { clientEscrows } = useClientAccounts();
  const { validateWithClient } = useValidateClient();
  const { cancel } = useCancel();
  const [escrow, setEscrow] = useState<Escrow>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey | null>(null);

  const handleAcceptClick = (escrow: PublicKey) => {
    validateWithClient.mutateAsync(escrow);
  };

  const handleCancelClick = (escrow: PublicKey) => {
    cancel.mutateAsync(escrow);
  };

  useEffect(() => {
    setEscrow(clientEscrows.data?.find((e) => e.publicKey === selectedEscrow));
  }, [clientEscrows.data, selectedEscrow]);

  return (
    <>
      <EscrowsDisplay
        escrows={clientEscrows.data}
        escrow={escrow?.account}
        onClick={(e) => setSelectedEscrow(e)}
      />

      {escrow?.account.status === 'request' ||
      escrow?.account.status === 'close' ? (
        <div className="card-actions justify-end">
          <button
            onClick={() => handleCancelClick(escrow.publicKey)}
            className="btn btn-primary"
          >
            Cancel
          </button>
        </div>
      ) : null}

      {escrow?.account.status === 'validate' ? (
        <div className="card-actions justify-end">
          <button
            onClick={() => window.open(escrow.account.uploadWork)}
            className={'btn btn-primary'}
            disabled={!escrow.account.uploadWork}
          >
            Check Uploaded work
          </button>
          <button
            onClick={() => handleAcceptClick(escrow.publicKey)}
            className="btn btn-primary"
          >
            Validate
          </button>
        </div>
      ) : null}
    </>
  );
}

interface EscrowProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

function Freelancer() {
  const { devEscrows } = useDevAccounts();
  const { exchange } = useExchange();
  const { uploadWork } = useUpload();
  const { declineRequest, acceptRequest } = useRequests();
  const [link, setLink] = useState('');
  const [escrow, setEscrow] = useState<Escrow>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey | null>(null);

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

  useEffect(() => {
    setEscrow(devEscrows.data?.find((e) => e.publicKey === selectedEscrow));
  }, [devEscrows.data, selectedEscrow]);

  return (
    <>
      <EscrowsDisplay
        escrows={devEscrows.data}
        escrow={escrow?.account}
        onClick={(e) => setSelectedEscrow(e)}
      />
      <div className="card-actions">
        {escrow?.account.status === 'request' ? (
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

        {escrow?.account.status === 'exchange' ? (
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

        {escrow?.account.status === 'upload' ? (
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
    </>
  );
}

type Escrow =
  | {
      account: anchor.IdlAccounts<AnchorEscrow>['escrow'];
      publicKey: PublicKey;
    }
  | null
  | undefined;

export default function Status() {
  const [isClient, setIsClient] = useState(true);
  const { userAccount } = useAccounts();

  useEffect(() => {
    setIsClient(userAccount.data?.role === 'Client' ? true : false);
  }, [userAccount.data?.role]);

  return (
    <div className="h-full">
      <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
        <div className="flex justify-between w-full">
          <h3 className="font-bold text-lg">Validate work</h3>

          <div className="flex">
            <span className="pr-2">{isClient ? 'Client' : 'Freelancer'}</span>
            <input
              type="checkbox"
              className="toggle"
              checked={!isClient}
              onChange={() => setIsClient(!isClient)}
            />
          </div>
        </div>
        {isClient ? <Client /> : <Freelancer />}
      </div>
    </div>
  );
}
