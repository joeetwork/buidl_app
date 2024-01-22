'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/hooks/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { PublicKey } from '@metaplex-foundation/js';
import * as anchor from '@coral-xyz/anchor';

export function useUpload() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, escrowAccounts } = useAccounts();
  const { publicKey } = useWallet();

  const uploadWork = useMutation({
    mutationKey: ['escrow', 'uploadWork', { cluster }],
    mutationFn: async () => {

      //temporary
      const escrow = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('escrow')),
          escrowAccounts.data[1]?.account.seed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      return program.methods
        .uploadWork("githublink.com")
        .accounts({
          taker: publicKey,
          initializer: escrowAccounts.data[1]?.account.initializer,
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
