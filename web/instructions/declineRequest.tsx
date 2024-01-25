'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/hooks/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';

import { usePDAs } from './get-PDAs';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

export function useDeclineRequest() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, escrowAccounts } = useAccounts();
  const { publicKey } = useWallet();
  const { mint } = usePDAs();

  interface RequestProps {
    pda: PublicKey;
    initializer: PublicKey;
  }

  const declineRequest = useMutation({
    mutationKey: ['escrow', 'declineRequest', { cluster }],
    mutationFn: async ({ pda, initializer }: RequestProps) => {
      if (!publicKey) {
        return Promise.resolve('');
      }

      const vault = getAssociatedTokenAddressSync(mint, pda, true);

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
          escrowState: pda,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return escrowAccounts.refetch();
    },
  });

  return { declineRequest };
}
