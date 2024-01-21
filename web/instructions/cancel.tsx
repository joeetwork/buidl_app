'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/hooks/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { PublicKey } from '@metaplex-foundation/js';
import * as anchor from '@coral-xyz/anchor';
import { usePDAs } from './get-PDAs';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

export function useCancel() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, escrowAccounts } = useAccounts();
  const { publicKey } = useWallet();
  const { mint } = usePDAs();

  const cancel = useMutation({
    mutationKey: ['escrow', 'cancel', { cluster }],
    mutationFn: () => {
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
        publicKey,
        true
      );

      return program.methods
        .cancel()
        .accounts({
          initializer: publicKey,
          mint: mint,
          initializerDepositTokenAccount: initializerDepositTokenAccount,
          vault: vault,
          escrowState: escrow,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return escrowAccounts.refetch();
    },
    onError: (err) => {
      return console.log(err);
    },
  });

  return { cancel };
}
