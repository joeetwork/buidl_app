'use client';

import { BuidlIDL, getBuidlProgramId } from '@buidl/anchor';
import { Program } from '@coral-xyz/anchor';
import { Cluster } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAnchorProvider } from '@/components/solana/anchor-provider';
import { useCluster } from '@/components/cluster/cluster-data-access';
import base58 from 'bs58';

interface UserAccountsProps {
  page: number;
  perPage: number;
  role?: string;
}

export function usePagination({ page, perPage, role }: UserAccountsProps) {
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBuidlProgramId(cluster.network as Cluster),
    [cluster]
  );

  const program = new Program(BuidlIDL, programId, provider);

  const userAccounts = useQuery({
    queryKey: ['userAccounts', { page }, { perPage }, { role }],
    queryFn: async () => {
      const accountsWithoutData = await provider.connection.getProgramAccounts(
        programId,
        {
          dataSlice: { offset: 0, length: 0 },
          filters: role
            ? [
                {
                  dataSize: 1452,
                  memcmp: {
                    offset: 448,
                    bytes: base58.encode(Buffer.from(role)),
                  },
                },
              ]
            : [
                {
                  dataSize: 1452,
                },
              ],
        }
      );

      const accountPublicKeys = accountsWithoutData.map(
        (account) => account.pubkey
      );

      const paginatedPublicKeys = accountPublicKeys.slice(
        (page - 1) * perPage,
        page * perPage
      );

      if (paginatedPublicKeys.length === 0) {
        return [];
      }

      const users = program.account.user.fetchMultiple(paginatedPublicKeys);

      return users;
    },
  });

  return {
    userAccounts,
  };
}
