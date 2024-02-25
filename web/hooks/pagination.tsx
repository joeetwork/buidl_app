'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAnchorProvider } from '@/components/solana/anchor-provider';
import base58 from 'bs58';
import { useProgram } from './get-program';

interface UserAccountsProps {
  page: number;
  perPage: number;
  freelancer?: boolean;
}

export function usePagination({
  page,
  perPage,
  freelancer,
}: UserAccountsProps) {
  const { program, programId } = useProgram();
  const provider = useAnchorProvider();
  const [maxAccounts, setMaxAccounts] = useState(0);

  const userAccounts = useQuery({
    queryKey: ['userPagination', { page }, { perPage }, { freelancer }],
    queryFn: async () => {
      const accountsWithoutData = await provider.connection.getProgramAccounts(
        programId,
        {
          dataSlice: { offset: 0, length: 0 },
          filters: freelancer
            ? [
                {
                  dataSize: 2477,
                  memcmp: {
                    offset: 448,
                    bytes: base58.encode(Buffer.from(true)),
                  },
                },
              ]
            : [
                {
                  dataSize: 2477,
                },
              ],
        }
      );

      setMaxAccounts(accountsWithoutData.length);

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

      const res = await program.account.user.fetchMultiple(paginatedPublicKeys);

      return res.length > 0 ? res : [];
    },
  });

  return {
    userAccounts,
    maxAccounts,
  };
}
