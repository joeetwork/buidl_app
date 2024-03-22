'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { usePDAs } from './get-PDAs';
import { useProgram } from './get-program';

interface InitialiseUserProps {
  name: string;
  about: string;
  role: string;
  pfp: string | null;
  links: {
    twitter: string | null;
    discord: string | null;
    telegram: string | null;
    github: string | null;
  };
}

export function useInitialiseUser() {
  const transactionToast = useTransactionToast();
  const { userAccounts, userAccount } = useAccounts();
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { userPDA } = usePDAs();

  const initializeUser = useMutation({
    mutationKey: ['initializeUser'],
    mutationFn: async ({
      name,
      about,
      role,
      pfp,
      links,
    }: InitialiseUserProps) => {
      if (publicKey) {
        return program.methods
          .initializeUser(name, about, role, pfp, links)
          .accounts({
            initializer: publicKey,
            userState: userPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      }
      return null;
    },
    onSuccess: (signature) => {
      transactionToast(signature ?? '');
      userAccount.refetch();
      return userAccounts.refetch();
    },
    onError: () => toast.error('Failed to initialize counter'),
  });

  return { initializeUser };
}
