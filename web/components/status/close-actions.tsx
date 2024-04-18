'use client';

import { useCancel } from '@/hooks/cancel';
import { PublicKey } from '@solana/web3.js';
import React from 'react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

interface CloseActionsProps {
  escrow?: {
    account: anchor.IdlAccounts<AnchorEscrow>['escrow'] | null;
    publicKey: PublicKey;
  };
}

export default function CloseActions({ escrow }: CloseActionsProps) {
  const { cancel } = useCancel();

  const handleCancelClick = (escrow?: PublicKey) => {
    if (escrow) {
      cancel.mutateAsync(escrow);
    }
  };

  return (
    <button
      onClick={() => handleCancelClick(escrow?.publicKey)}
      className="btn bg-black text-white w-full"
      disabled={
        !(
          escrow?.account?.status === 'close' ||
          escrow?.account?.status === 'request'
        ) || cancel.isPending
      }
    >
      Cancel
    </button>
  );
}
