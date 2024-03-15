'use client';

import React from 'react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

interface EscrowInfoProps {
  escrow?: anchor.IdlAccounts<AnchorEscrow>['escrow'] | null;
}

export default function EscrowInfo({ escrow }: EscrowInfoProps) {
  return (
    <div
      className={`bg-gray-500 rounded-lg p-4 hover:ring hover:ring-gray-700 w-full h-[210px]`}
    >
      <div className="w-full flex flex-col">
        <span className="label-text cursor-default">Contract Information</span>
      </div>
      <div className="flex justify-between">
        <div className="rounded bg-black p-4 w-[49%]">
          {escrow?.voteDeadline}
        </div>
        <button
          onClick={() => window.open(escrow?.uploadWork)}
          className={'btn btn-primary w-[49%]'}
          disabled={!escrow?.uploadWork}
        >
          Check Uploaded work
        </button>
      </div>
      <div className="rounded bg-black p-4 mt-2 h-[100px] overflow-y-scroll">
        {escrow?.about}
      </div>
    </div>
  );
}
