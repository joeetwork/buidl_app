'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { usePDAs } from './get-PDAs';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

export function useCancel() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useAccounts();
  const { publicKey } = useWallet();
  const { mint } = usePDAs();
  const { hiringEscrows } = useAccounts();

  const cancel = useMutation({
    mutationKey: ['escrow', 'cancel', { cluster }],
    mutationFn: async () => {
      if (
        publicKey &&
        Array.isArray(hiringEscrows.data) &&
        hiringEscrows.data[0]
      ) {
        const vault = getAssociatedTokenAddressSync(
          mint,
          hiringEscrows.data[0].publicKey,
          true
        );

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
            escrowState: hiringEscrows.data[0].publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .rpc();
      }
      return '';
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return hiringEscrows.refetch();
    },
    onError: (err) => {
      return console.log(err);
    },
  });

  return { cancel };
}
