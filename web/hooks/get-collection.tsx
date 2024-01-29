'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@metaplex-foundation/js';

export function useCollection(selectedCollection?: PublicKey) {
  const { publicKey } = useWallet();

  const collection = useQuery({
    queryKey: ['collection', selectedCollection],
    queryFn: async () => {
      if (selectedCollection) {
        const res = await fetch('/api/search-assets', {
          method: 'POST',
          body: JSON.stringify({
            ownerAddress: publicKey?.toString(),
            grouping: ['collection', selectedCollection?.toString()],
          }),
        });
        const data = res.json();
        return data;
      }
      return null;
    },
  });

  return { collection };
}
