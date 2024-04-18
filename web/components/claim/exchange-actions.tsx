'use client';

import { useExchange } from '@/hooks/exchange';
import { PublicKey } from '@solana/web3.js';
import React from 'react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

interface ExchangeProps {
  escrow?: PublicKey;
  initializer?: PublicKey;
}

interface ExchangeActionsProps {
  escrow?: {
    account: anchor.IdlAccounts<AnchorEscrow>['escrow'] | null;
    publicKey: PublicKey;
  } | null;
}

export default function Exchange({ escrow }: ExchangeActionsProps) {
  const { exchange } = useExchange();

  const handleExchange = ({ escrow, initializer }: ExchangeProps) => {
    if (escrow && initializer) {
      exchange.mutateAsync({ escrow, initializer });
    }
  };

  return (
    <button
      className="btn bg-black text-white w-full"
      onClick={() =>
        handleExchange({
          escrow: escrow?.publicKey,
          initializer: escrow?.account?.initializer,
        })
      }
      disabled={escrow?.account?.status !== 'exchange' || exchange.isPending}
    >
      Exchange
    </button>
  );
}
