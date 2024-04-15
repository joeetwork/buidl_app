'use client';
import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';
import EscrowsDisplay from '../shared/escrow-display';
import { useClientAccounts } from '@/hooks/get-accounts';
import Close from './close';
import Validate from './validate';

type Escrow =
  | {
      account: anchor.IdlAccounts<AnchorEscrow>['escrow'];
      publicKey: PublicKey;
    }
  | null
  | undefined;

export default function ActiveContracts() {
  const { clientEscrows } = useClientAccounts();
  const [escrow, setEscrow] = useState<Escrow>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey | null>(null);

  useEffect(() => {
    setEscrow(clientEscrows.data?.find((e) => e.publicKey === selectedEscrow));
  }, [clientEscrows.data, selectedEscrow]);

  return (
    <div className="h-full">
      <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
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
      </div>
    </div>
  );
}
