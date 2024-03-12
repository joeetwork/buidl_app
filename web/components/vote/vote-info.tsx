'use client';

import React from 'react';
import { useProgram } from '@/hooks/get-program';
import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';

interface VoteInfo {
  contract?: PublicKey | null;
}

export default function VoteInfo({ contract }: VoteInfo) {
  const { program } = useProgram();

  const validatorCollectionEscrow = useQuery({
    queryKey: ['validatorCollectionEscrows', { contract }],
    queryFn: async () => {
      if (contract) {
        return await program.account.escrow.fetch(contract);
      }
      return null;
    },
  });

  return (
    <div
      className={`bg-gray-500 rounded-lg p-4 hover:ring hover:ring-gray-700 w-full`}
    >
      <div className="w-full">
        <span className="label-text cursor-default">Contract Information</span>
      </div>
      <div className="flex justify-between w-full">
        <div>{validatorCollectionEscrow.data?.about}</div>
      </div>
    </div>
  );
}
