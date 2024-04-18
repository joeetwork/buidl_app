'use client';
import React, { useState } from 'react';
import EscrowsDisplay from '../shared/escrow-display';
import { useClientAccounts } from '@/hooks/get-accounts';
import CloseActions from './close-actions';
import ValidateActions from './validate-actions';

export default function ActiveContracts() {
  const { clientEscrows } = useClientAccounts();
  const [selectedEscrow, setSelectedEscrow] = useState<number>(-1);

  const escrow = clientEscrows.data?.filter(
    (escrow) =>
      escrow.account.status === 'request' ||
      escrow?.account.status === 'close' ||
      escrow?.account.status === 'validate'
  );

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
          escrow={escrow && escrow[selectedEscrow]?.account}
          onClick={(e, i) => setSelectedEscrow(i)}
        />

        <div className="card-actions w-full">
          {escrow &&
            (escrow[selectedEscrow]?.account.status === 'request' ||
              escrow[selectedEscrow]?.account.status === 'close') && (
              <CloseActions escrow={escrow && escrow[selectedEscrow]} />
            )}

          {escrow && escrow[selectedEscrow]?.account.status === 'validate' && (
            <ValidateActions escrow={escrow && escrow[selectedEscrow]} />
          )}
        </div>
      </div>
    </div>
  );
}
