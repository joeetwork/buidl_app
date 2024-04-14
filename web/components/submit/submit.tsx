'use client';
import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import EscrowsDisplay from '../shared/escrow-display';
import { useDevAccounts } from '@/hooks/get-accounts';
import Upload from './upload';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

type Escrow =
  | {
      account: anchor.IdlAccounts<AnchorEscrow>['escrow'];
      publicKey: PublicKey;
    }
  | null
  | undefined;

export default function Submit() {
  const { devEscrows } = useDevAccounts();
  const [escrow, setEscrow] = useState<Escrow>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey | null>(null);

  useEffect(() => {
    setEscrow(devEscrows.data?.find((e) => e.publicKey === selectedEscrow));
  }, [devEscrows.data, selectedEscrow]);

  return (
    <div className="h-full">
      <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
        <div className="flex justify-between w-full">
          <h3 className="font-bold text-lg">Submit</h3>
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
          {escrow?.account.status === 'upload' && (
            <Upload
              escrow={escrow.publicKey}
              initializer={escrow.account.initializer}
            />
          )}
        </div>
      </div>
    </div>
  );
}
