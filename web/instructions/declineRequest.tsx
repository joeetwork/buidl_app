'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/hooks/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { PublicKey } from '@metaplex-foundation/js';
import * as anchor from '@coral-xyz/anchor';
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

  const declineRequest = useMutation({
    mutationKey: ['escrow', 'declineRequest', { cluster }],
    mutationFn: async () => {
      if (!publicKey) {
        return Promise.resolve('');
      }

      const escrow = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('escrow')),
          escrowAccounts.data[1]?.account.seed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      const vault = getAssociatedTokenAddressSync(mint, escrow, true);

      const initializerDepositTokenAccount = getAssociatedTokenAddressSync(
        mint,
        escrowAccounts.data[1].account.initializer,
        true
      );

      return program.methods
        .declineRequest()
        .accounts({
          taker: publicKey,
          initializer: escrowAccounts.data[1].account.initializer,
          mint: mint,
          initializerDepositTokenAccount: initializerDepositTokenAccount,
          vault: vault,
          escrowState: escrow,
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
