'use client'

import React, { useEffect } from 'react';
import Input from '../input';
import Image from 'next/image';
import TextArea from '../text-area';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

interface EscrowProps {
  collections: PublicKey[];
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  escrow: {
    initializerAmount: number;
    taker: PublicKey;
    collection: PublicKey;
    about: string;
    validatorCount: number;
  };
}

export default function Escrow({ collections, onChange, escrow }: EscrowProps) {
  const { initializerAmount, taker, validatorCount, about } = escrow;

  const { publicKey } = useWallet();

  const { data, isLoading } = useQuery({
    queryKey: ['collection'],
    queryFn: async () => {
      const res = await fetch('/api/helius', {
        method: 'POST',
        body: JSON.stringify({
          ownerAddress: collections[0]?.toBase58(),
        }),
      });
      const data = res.json();
      return data;
    },
  });

  useEffect(() => {
    console.log(data, isLoading);
  }, [data, isLoading]);

  return (
    <div className="flex flex-col gap-4">
      <div>PublicKey:{taker.toString()}</div>

      <TextArea name="about" label="About:" value={about} onChange={onChange} />

      <Input
        name="initializerAmount"
        label="Amount:"
        value={initializerAmount.toString()}
        onChange={onChange}
      />

      <Input
        name="validatorCount"
        label="Validator Count:"
        value={validatorCount.toString()}
        onChange={onChange}
      />


        {/* <Image src={collection} alt="collection" />; */}

    </div>
  );
}
