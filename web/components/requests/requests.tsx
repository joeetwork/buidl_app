'use client';

import React, { useState } from 'react';
import { useDevAccounts } from '@/hooks/get-accounts';
import EscrowsDisplay from '../shared/escrow-display';
import RequestActions from './request-actions';

export default function Requests() {
  const [selectedEscrow, setSelectedEscrow] = useState<number>(-1);
  const { devEscrows } = useDevAccounts();

  const escrow = devEscrows.data?.filter(
    (escrow) => escrow.account.status === 'request'
  );

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
          escrow={escrow && escrow[selectedEscrow]?.account}
          onClick={(e, i) => setSelectedEscrow(i)}
        />

        <RequestActions escrow={escrow && escrow[selectedEscrow]} />
      </div>
    </div>
  );
}
