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
  freelancer: boolean;
  pfp: string | null;
  twitter: string | null;
  discord: string | null;
  telegram: string | null;
  github: string | null;
}

export function useInitialiseUser() {
  const transactionToast = useTransactionToast();
  const { userAccounts } = useAccounts();
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { userPDA } = usePDAs();

  const initializeUser = useMutation({
    mutationKey: ['initializeUser'],
    mutationFn: async ({
      name,
      about,
      freelancer,
      pfp,
      twitter,
      discord,
      telegram,
      github,
    }: InitialiseUserProps) => {
      if (publicKey) {
        return program.methods
          .initializeUser(
            name,
            about,
            freelancer,
            pfp,
            twitter,
            discord,
            telegram,
            github
          )
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
      return userAccounts.refetch();
    },
    onError: () => toast.error('Failed to initialize counter'),
  });

  return { initializeUser };
}
