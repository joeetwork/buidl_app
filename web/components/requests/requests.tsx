'use client';

import React, { useState } from 'react';
import VoteInfo from './vote-info';
import VoteActions from './vote-actions';
import VoteContracts from './vote-contracts';
import { PublicKey } from '@solana/web3.js';
import { useRequests } from '@/hooks/requests';
import { useDevAccounts } from '@/hooks/get-accounts';

export default function Requests() {
  const [contract, setContract] = useState<PublicKey | null>(null);
  const { devEscrows, devEscrow } = useDevAccounts(contract);

  const { declineRequest, acceptRequest } = useRequests();

  const handleAcceptClick = () => {
    if (contract && devEscrow.data) {
      acceptRequest.mutateAsync({
        escrow: contract,
        initializer: devEscrow.data.initializer,
      });
    }
  };

  const handleDeclineClick = () => {
    if (contract && devEscrow.data) {
      declineRequest.mutateAsync({
        escrow: contract,
        initializer: devEscrow.data.initializer,
      });
    }
  };

  return (
    <div className="h-full">
      <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
        <div className="flex justify-between w-full">
          <h3 className="font-bold text-lg">Requests</h3>
        </div>
        <VoteContracts
          escrows={devEscrows.data?.filter(
            (escrow) => escrow.account.status === 'request'
          )}
          onClick={(e) => setContract(e)}
        />

        <VoteInfo escrow={devEscrow.data} />

        <VoteActions
          onAcceptClick={handleAcceptClick}
          onDeclineClick={handleDeclineClick}
          escrow={devEscrow.data}
          isPending={devEscrow.isPending}
        />
      </div>
    </div>
  );
}
