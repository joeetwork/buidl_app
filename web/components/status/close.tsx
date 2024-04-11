'use client';

import { useCancel } from '@/hooks/cancel';
import { PublicKey } from '@solana/web3.js';
import React from 'react';

interface CloseProps {
  pubKey: PublicKey;
}

export default function Close({ pubKey }: CloseProps) {
  const { cancel } = useCancel();

  const handleCancelClick = (escrow: PublicKey) => {
    cancel.mutateAsync(escrow);
  };

  return (
    <button
      onClick={() => handleCancelClick(pubKey)}
      className="btn btn-primary w-full"
    >
      Cancel
    </button>
  );
}
