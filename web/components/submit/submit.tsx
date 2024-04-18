'use client';
import React, { useState } from 'react';
import EscrowsDisplay from '../shared/escrow-display';
import { useDevAccounts } from '@/hooks/get-accounts';
import UploadActions from './upload-actions';

export default function Submit() {
  const { devEscrows } = useDevAccounts();
  const [selectedEscrow, setSelectedEscrow] = useState<number>(-1);

  const escrow = devEscrows.data?.filter(
    (escrow) => escrow.account.status === 'upload'
  );

  return (
    <div className="h-full">
      <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
        <div className="flex justify-between w-full">
          <h3 className="font-bold text-lg">Submit</h3>
        </div>
        <EscrowsDisplay
          escrows={devEscrows.data?.filter(
            (escrow) => escrow?.account.status === 'upload'
          )}
          escrow={escrow && escrow[selectedEscrow]?.account}
          onClick={(e, i) => setSelectedEscrow(i)}
        />
        <div className="card-actions w-full">
          <UploadActions escrow={escrow && escrow[selectedEscrow]} />
        </div>
      </div>
    </div>
  );
}
