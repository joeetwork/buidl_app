'use client';

import { useQuery } from '@tanstack/react-query';
import { Item } from '@/types/search-assets';

export function useMetadata(collections: string[])  {
  const { data } = useQuery({
    queryKey: ['nftMetadata', collections],
    queryFn: async () => {
      if (collections) {
        const res = await fetch('/api/get-asset-batch', {
          method: 'POST',
          body: JSON.stringify({
            ids: collections,
          }),
        });
        const data = res.json();
        return data;
      }
      return null;
    },
  });

  return { metadata: data?.result as Item[] };
}
