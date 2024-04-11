'use client';

import { useValidateClient } from '@/hooks/validate';
import { PublicKey } from '@solana/web3.js';
import React from 'react';

interface ValidateProps {
  pubKey: PublicKey;
  uploadWork: string;
}

export default function Validate({ pubKey, uploadWork }: ValidateProps) {
  const { validateWithClient } = useValidateClient();

  const handleClick = (escrow: PublicKey) => {
    validateWithClient.mutateAsync(escrow);
  };

  return (
    <div className="flex w-full justify-between">
      <button
        onClick={() => window.open(uploadWork)}
        className={'btn btn-primary w-[49%]'}
        disabled={!uploadWork}
      >
        Check Uploaded work
      </button>
      <button
        onClick={() => handleClick(pubKey)}
        className="btn btn-primary w-[49%]"
      >
        Validate
      </button>
    </div>
  );
}
