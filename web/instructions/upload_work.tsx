'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/hooks/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { PublicKey } from '@metaplex-foundation/js';

interface UploadProps {
  escrow: PublicKey,
  initializer: PublicKey,
  link: string
}

export function useUpload() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useAccounts();
  const { publicKey } = useWallet();

  const uploadWork = useMutation({
    mutationKey: ['escrow', 'uploadWork', { cluster }],
    mutationFn: async ({escrow, initializer, link}: UploadProps) => {
      if (!publicKey) {
        return Promise.resolve('');
      }

      return program.methods
        .uploadWork(link)
        .accounts({
          taker: publicKey,
          initializer: initializer,
          escrowState: escrow,
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

  return { uploadWork };
}
