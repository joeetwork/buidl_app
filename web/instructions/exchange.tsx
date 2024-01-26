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
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

interface EscrowProps {
  escrow: PublicKey,
  initializer: PublicKey
}

export function useExchange() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, escrowAccounts } = useAccounts();
  const { publicKey } = useWallet();
  const { mint } = usePDAs();

  const exchange = useMutation({
    mutationKey: ['escrow', 'exchange', { cluster }],
    mutationFn: async ({escrow, initializer}: EscrowProps) => {
      if (!publicKey) {
        return Promise.resolve('');
      }

      const vault = getAssociatedTokenAddressSync(mint, escrow, true);

      const takerTokenAccount = await getAssociatedTokenAddress(
        mint,
        publicKey,
        true
      );

      return program.methods
        .exchange()
        .accounts({
          taker: publicKey,
          mint: mint,
          takerReceiveTokenAccount: takerTokenAccount,
          initializer,
          escrowState: escrow,
          vault: vault,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      //   return account.refetch();
      return;
    },
  });

  return { exchange };
}
