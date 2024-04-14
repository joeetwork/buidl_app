'use client';

import { useExchange } from '@/hooks/exchange';
import { PublicKey } from '@solana/web3.js';
import React from 'react';

interface ExchangeProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

export default function Exchange({ escrow, initializer }: ExchangeProps) {
  const { exchange } = useExchange();

  const handleExchange = (data: ExchangeProps) => {
    exchange.mutateAsync(data);
  };

  return (
    <button
      className="btn btn-primary w-full"
      onClick={() =>
        handleExchange({
          escrow,
          initializer,
        })
      }
      disabled={exchange.isPending}
    >
      Exchange
    </button>
  );
}
