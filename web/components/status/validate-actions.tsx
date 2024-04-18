'use client';

import { useValidateClient } from '@/hooks/validate';
import { PublicKey } from '@solana/web3.js';
import React from 'react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

interface ValidateActionsProps {
  escrow?: {
    account: anchor.IdlAccounts<AnchorEscrow>['escrow'] | null;
    publicKey: PublicKey;
  } | null;
}

export default function ValidateActions({ escrow }: ValidateActionsProps) {
  const { validateWithClient } = useValidateClient();

  const handleClick = (escrow?: PublicKey) => {
    if (escrow) {
      validateWithClient.mutateAsync(escrow);
    }
  };

  return (
    <div className="flex w-full justify-between">
      <button
        onClick={() => window.open(escrow?.account?.uploadWork)}
        className={'btn bg-black text-white w-[49%]'}
        disabled={!escrow?.account?.uploadWork}
      >
        Check Uploaded work
      </button>
      <button
        onClick={() => handleClick(escrow?.publicKey)}
        className="btn bg-black text-white w-[49%]"
        disabled={
          escrow?.account?.status !== 'validate' || validateWithClient.isPending
        }
      >
        Validate
      </button>
    </div>
  );
}
