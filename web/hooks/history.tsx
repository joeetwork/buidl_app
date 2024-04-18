'use client';

import { useQuery } from '@tanstack/react-query';
import { useProgram } from './get-program';
import { useWallet } from '@solana/wallet-adapter-react';

interface UserAccountsProps {
  role?: string;
}

export function useHistory({ role }: UserAccountsProps) {
  const { program } = useProgram();
  const { publicKey } = useWallet();

  const uploadHistory = useQuery({
    queryKey: ['userPagination', { publicKey }, { role }],
    queryFn: async () => {
      if (publicKey && role === 'freelancer') {
        const res = await program.account.upload.all([
          {
            memcmp: {
              offset: 40,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);

        return res.length > 0 ? res : [];
      }

      if (publicKey && role === 'client') {
        const res = await program.account.upload.all([
          {
            memcmp: {
              offset: 8,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);

        return res.length > 0 ? res : [];
      }

      return null;
    },
  });

  return {
    uploadHistory,
  };
}
