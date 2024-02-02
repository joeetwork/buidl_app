'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as anchor from '@coral-xyz/anchor';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { usePDAs } from './get-PDAs';

interface InitializeEscrowProps {
  initializerAmount: number;
  taker: PublicKey;
  collection: PublicKey;
  validatorCount: number;
  about: string;
}

export function useInitialiseEscrow() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, devEscrows } = useAccounts();
  const { publicKey } = useWallet();
  const { mint, seed, escrowPDA, vaultPDA } = usePDAs();

  const initializeEscrow = useMutation({
    mutationKey: ['initializeEscrow', 'initialize', { cluster }],
    mutationFn: async ({
      initializerAmount,
      taker,
      collection,
      validatorCount,
      about,
    }: InitializeEscrowProps) => {
      if (publicKey) {
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
            validatorCount,
            taker,
            collection,
            about
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
      }
      return null;
    },
    onSuccess: (signature) => {
      transactionToast(signature ?? '');
      return devEscrows.refetch();
    },
    onError: () => toast.error('Failed to initialize counter'),
  });

  return { initializeEscrow };
}
