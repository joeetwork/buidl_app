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
      className={`bg-gray-500 rounded-lg p-4 hover:ring hover:ring-gray-700 w-full h-[210px]`}
    >
      <div className="w-full flex flex-col">
        <span className="label-text cursor-default">Contract Information</span>
      </div>
      <div className="flex justify-between">
        <div className="rounded bg-black p-4 w-[49%]">
          {validatorCollectionEscrow.data?.voteDeadline}
        </div>
        <button
          onClick={() =>
            window.open(validatorCollectionEscrow.data?.uploadWork)
          }
          className={'btn btn-primary w-[49%]'}
          disabled={!validatorCollectionEscrow.data?.uploadWork}
        >
          Check Uploaded work
        </button>
      </div>
      <div className="rounded bg-black p-4 mt-2 h-[100px] overflow-y-scroll">
        {validatorCollectionEscrow.data?.about}
      </div>
    </div>
  );
}
