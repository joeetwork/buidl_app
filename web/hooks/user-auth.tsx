'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { useProgram } from './get-program';
import { useInitialiseUser } from './initialize-user';
import { useAnchorProvider } from '@/components/solana/anchor-provider';

export function useAuth() {
  const { programId } = useProgram();
  const { publicKey } = useWallet();
  const { initializeUser } = useInitialiseUser();
  const provider = useAnchorProvider();

  const noDataUserAccount = useQuery({
    queryKey: ['noDataUserAccount', { publicKey }],
    queryFn: async () => {
      if (publicKey) {
        const accountsWithoutData =
          await provider.connection.getProgramAccounts(programId, {
            dataSlice: { offset: 0, length: 0 },
            filters: [
              {
                memcmp: {
                  offset: 8,
                  bytes: publicKey?.toBase58(),
                },
              },
            ],
          });

        const initializeUserData = async () => {
          if (localStorage.getItem('account') !== publicKey.toString()) {
            localStorage.removeItem('account');
          }

          if (
            accountsWithoutData.length === 0 &&
            !localStorage.getItem('account')
          ) {
            await initializeUser.mutateAsync({
              name: publicKey?.toString() ?? '',
              about: '',
              role: 'Voter',
              pfp: null,
              links: {
                discord: null,
                telegram: null,
                twitter: null,
                github: null,
              },
            });
          }

          if (accountsWithoutData.length > 0) {
            localStorage.setItem('account', `${publicKey}`);
          }
        };

        initializeUserData();

        return null;
      }
      return null;
    },
  });

  return {
    noDataUserAccount,
  };
}
