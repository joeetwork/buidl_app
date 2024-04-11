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
    <div className="card-actions justify-end">
      <button
        onClick={() => handleCancelClick(pubKey)}
        className="btn btn-primary"
      >
        Cancel
      </button>
    </div>
  );
}
