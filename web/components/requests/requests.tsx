'use client';

import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useRequests } from '@/hooks/requests';
import { useDevAccounts } from '@/hooks/get-accounts';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';
import EscrowsDisplay from '../shared/escrow-display';
import EscrowActions from '../shared/escrow-actions';

type Escrow =
  | {
      account: anchor.IdlAccounts<AnchorEscrow>['escrow'];
      publicKey: PublicKey;
    }
  | null
  | undefined;

export default function Requests() {
  const [contract, setContract] = useState<PublicKey | null>(null);
  const [escrow, setEscrow] = useState<Escrow>();
  const { devEscrows } = useDevAccounts(contract);
  const { declineRequest, acceptRequest } = useRequests();

  const handleAcceptClick = () => {
    if (contract && escrow) {
      acceptRequest.mutateAsync({
        escrow: contract,
        initializer: escrow.account.initializer,
      });
    }
  };

  const handleDeclineClick = () => {
    if (contract && escrow) {
      declineRequest.mutateAsync({
        escrow: contract,
        initializer: escrow.account.initializer,
      });
    }
  };

  const handleContract = (e: PublicKey, i: number) => {
    setContract(e);
  };

  useEffect(() => {
    setEscrow(devEscrows.data?.find((e) => e.publicKey === contract));
  }, [contract]);

  return (
    <div className="h-full">
      <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
        <div className="flex justify-between w-full">
          <h3 className="font-bold text-lg">Requests</h3>
        </div>
        <EscrowsDisplay
          escrows={devEscrows.data?.filter(
            (escrow) => escrow.account.status === 'request'
          )}
          escrow={escrow?.account}
          onClick={handleContract}
        />

        <EscrowActions
          onAcceptClick={handleAcceptClick}
          onDeclineClick={handleDeclineClick}
          escrow={escrow?.account}
          isPending={acceptRequest.isPending || declineRequest.isPending}
        />
      </div>
    </div>
  );
}
