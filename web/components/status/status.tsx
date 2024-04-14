'use client';
import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';
import EscrowsDisplay from '../shared/escrow-display';
import { useClientAccounts, useDevAccounts } from '@/hooks/get-accounts';
import Close from './close';
import Validate from './validate';
import Exchange from './exchange';
import Upload from './upload';

type Escrow =
  | {
      account: anchor.IdlAccounts<AnchorEscrow>['escrow'];
      publicKey: PublicKey;
    }
  | null
  | undefined;

function Client() {
  const { clientEscrows } = useClientAccounts();
  const [escrow, setEscrow] = useState<Escrow>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey | null>(null);

  useEffect(() => {
    setEscrow(clientEscrows.data?.find((e) => e.publicKey === selectedEscrow));
  }, [clientEscrows.data, selectedEscrow]);

  return (
    <>
      <div className="flex justify-between w-full">
        <h3 className="font-bold text-lg">Active Contracts</h3>
      </div>
      <EscrowsDisplay
        escrows={clientEscrows.data?.filter(
          (escrow) =>
            escrow.account.status === 'request' ||
            escrow?.account.status === 'close' ||
            escrow?.account.status === 'validate'
        )}
        escrow={escrow?.account}
        onClick={(e) => setSelectedEscrow(e)}
      />

      <div className="card-actions w-full">
        {(escrow?.account.status === 'request' ||
          escrow?.account.status === 'close') && (
          <Close pubKey={escrow.publicKey} />
        )}

        {escrow?.account.status === 'validate' && (
          <Validate
            pubKey={escrow.publicKey}
            uploadWork={escrow.account.uploadWork}
          />
        )}
      </div>
    </>
  );
}

function Freelancer() {
  const { devEscrows } = useDevAccounts();
  const [escrow, setEscrow] = useState<Escrow>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey | null>(null);

  useEffect(() => {
    setEscrow(devEscrows.data?.find((e) => e.publicKey === selectedEscrow));
  }, [devEscrows.data, selectedEscrow]);

  return (
    <>
      <div className="flex justify-between w-full">
        <h3 className="font-bold text-lg">Active Contracts</h3>
      </div>
      <EscrowsDisplay
        escrows={devEscrows.data?.filter(
          (escrow) =>
            escrow.account.status === 'exchange' ||
            escrow?.account.status === 'upload'
        )}
        escrow={escrow?.account}
        onClick={(e) => setSelectedEscrow(e)}
      />
      <div className="card-actions w-full">
        {escrow?.account.status === 'exchange' && (
          <Exchange
            escrow={escrow.publicKey}
            initializer={escrow.account.initializer}
          />
        )}

        {escrow?.account.status === 'upload' && (
          <Upload
            escrow={escrow.publicKey}
            initializer={escrow.account.initializer}
          />
        )}
      </div>
    </>
  );
}

export default function Status() {
  const [isClient, setIsClient] = useState(true);

  return (
    <div className="h-full">
      <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
        {isClient ? <Client /> : <Freelancer />}
      </div>
    </div>
  );
}
