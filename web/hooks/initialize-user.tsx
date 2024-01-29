'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { usePDAs } from './get-PDAs';

interface InitialiseUserProps {
  name: string;
  about: string;
  role: string;
}

export function useInitialiseUser() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, userAccounts } = useAccounts();
  const { publicKey } = useWallet();
  const { userPDA } = usePDAs();

  const initializeUser = useMutation({
    mutationKey: ['escrow', 'initializeUser', { cluster }],
    mutationFn: async ({ name, about, role }: InitialiseUserProps) => {
      if (!publicKey) {
        return Promise.resolve('');
      }

      return program.methods
        .initializeUser(name, about, role)
        .accounts({
          initializer: publicKey,
          userState: userPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return userAccounts.refetch();
    },
    onError: () => toast.error('Failed to initialize counter'),
  });

  return { initializeUser };
}