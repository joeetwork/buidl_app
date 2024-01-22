'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as anchor from '@coral-xyz/anchor';
import { useTransactionToast } from '@/hooks/use-transaction-toast';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { usePDAs } from './get-PDAs';

export function useInitialiseEscrow() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, escrowAccounts } = useAccounts();
  const { publicKey } = useWallet();
  const { mint, seed, escrowPDA, vaultPDA } = usePDAs();

  const initializeEscrow = useMutation({
    mutationKey: ['escrow', 'initialize', { cluster }],
    mutationFn: async (initializerAmount: number) => {
      if (!publicKey) {
        return Promise.resolve('');
      }

      const initializerTokenAccount = await getAssociatedTokenAddress(
        mint,
        publicKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      return program.methods
        .initialize(
          seed,
          new anchor.BN(initializerAmount),
          new anchor.BN(1),
          new PublicKey('F17gXajNLmVdMXtCPVpJ8enhwoxtscmDf7fLoJE8vUgw'),
          new PublicKey('9ifBnWRecQxF3b4UfqEWp2pw7a6UAVBYiDfYYB7UtFq2')
        )
        .accounts({
          initializer: publicKey,
          vault: vaultPDA,
          mint: mint,
          initializerDepositTokenAccount: initializerTokenAccount,
          escrowState: escrowPDA,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature ?? '');
      return escrowAccounts.refetch();
    },
    onError: () => toast.error('Failed to initialize counter'),
  });

  return { initializeEscrow };
}
