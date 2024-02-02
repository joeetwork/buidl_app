'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { PublicKey } from '@metaplex-foundation/js';
import { usePDAs } from './get-PDAs';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

interface EscrowProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

export function useExchange() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useAccounts();
  const { publicKey } = useWallet();
  const { mint } = usePDAs();
  const { devEscrows } = useAccounts();

  const exchange = useMutation({
    mutationKey: ['exchange', { cluster }],
    mutationFn: async ({ escrow, initializer }: EscrowProps) => {
      if (publicKey) {
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
      }
      return null;
    },
    onSuccess: (tx) => {
      transactionToast(tx ?? '');
      return devEscrows.refetch();
    },
  });

  return { exchange };
}
