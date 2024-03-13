'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@metaplex-foundation/js';
import { Assets } from '@/types/search-assets';

export function useCollection(selectedCollection: PublicKey | null) {
  const { publicKey } = useWallet();

  const { data, isPending } = useQuery({
    queryKey: ['collection', selectedCollection, publicKey],
    queryFn: async () => {
      if (selectedCollection && publicKey) {
        const res = await fetch('/api/search-assets', {
          method: 'POST',
          body: JSON.stringify({
            ownerAddress: publicKey.toString(),
            grouping: ['collection', selectedCollection?.toString()],
            limit: 1,
          }),
        });
        const data = res.json();
        return data;
      }
      return null;
    },
  });

  return { collections: data as Assets, isPending };
}
