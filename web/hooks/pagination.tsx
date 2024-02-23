'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAnchorProvider } from '@/components/solana/anchor-provider';
import base58 from 'bs58';
import { useProgram } from './get-program';

interface UserAccountsProps {
  page: number;
  perPage: number;
  role?: string;
}

export function usePagination({ page, perPage, role }: UserAccountsProps) {
  const { program, programId } = useProgram();
  const provider = useAnchorProvider();
  const [maxAccounts, setMaxAccounts] = useState(0);

  const userAccounts = useQuery({
    queryKey: ['userPagination', { page }, { perPage }, { role }],
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
