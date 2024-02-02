'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';

import { usePDAs } from './get-PDAs';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

export function useRequests() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useAccounts();
  const { publicKey } = useWallet();
  const { mint } = usePDAs();
  const { devEscrows } = useAccounts();

  interface RequestProps {
    escrow: PublicKey;
    initializer: PublicKey;
  }

  const acceptRequest = useMutation({
    mutationKey: ['acceptRequest', { cluster }],
    mutationFn: async ({ escrow, initializer }: RequestProps) => {
      if (publicKey) {
        const vault = getAssociatedTokenAddressSync(mint, escrow, true);

        const initializerDepositTokenAccount = getAssociatedTokenAddressSync(
          mint,
          initializer,
          true
        );

        return program.methods
          .acceptRequest()
          .accounts({
            taker: publicKey,
            initializer: initializer,
            mint: mint,
            initializerDepositTokenAccount: initializerDepositTokenAccount,
            vault: vault,
            escrowState: escrow,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      }
      return null;
    },
    onSuccess: (tx) => {
      transactionToast(tx ?? '');
      return devEscrows.refetch();
    },
  });

  const declineRequest = useMutation({
    mutationKey: ['declineRequest', { cluster }],
    mutationFn: async ({ escrow, initializer }: RequestProps) => {
      if (publicKey) {
        const vault = getAssociatedTokenAddressSync(mint, escrow, true);

        const initializerDepositTokenAccount = getAssociatedTokenAddressSync(
          mint,
          initializer,
          true
        );

        return program.methods
          .declineRequest()
          .accounts({
            taker: publicKey,
            initializer: initializer,
            mint: mint,
            initializerDepositTokenAccount: initializerDepositTokenAccount,
            vault: vault,
            escrowState: escrow,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      }
      return null;
    },
    onSuccess: (tx) => {
      transactionToast(tx ?? '');
      return devEscrows.refetch();
    },
  });

  return { declineRequest, acceptRequest };
}
