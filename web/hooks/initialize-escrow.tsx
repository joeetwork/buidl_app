'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as anchor from '@coral-xyz/anchor';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { usePDAs } from './get-PDAs';
import { useProgram } from './get-program';

interface InitializeEscrowProps {
  initializerAmount: number;
  taker: PublicKey;
  collection: PublicKey | null;
  validator: PublicKey | null;
  about: string;
}

export function useInitialiseEscrow() {
  const transactionToast = useTransactionToast();
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { mint, seed, escrowPDA, vaultPDA, userPDA } = usePDAs();

  const devEscrows = useQuery({
    queryKey: ['devEscrows', { publicKey }],
    queryFn: async () => {
      if (publicKey) {
        const res = await program.account.escrow.all([
          {
            memcmp: {
              offset: 49,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);

        return res.length > 0 ? res : [];
      }
      return null;
    },
  });

  const initializeEscrow = useMutation({
    mutationKey: ['initializeEscrow', 'initialize'],
    mutationFn: async ({
      initializerAmount,
      taker,
      collection,
      validator,
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
            validator,
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
            userState: userPDA,
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
