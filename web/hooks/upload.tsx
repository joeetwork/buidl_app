'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
import { useDevAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { PublicKey } from '@metaplex-foundation/js';
import { useProgram } from './get-program';

interface UploadProps {
  escrow: PublicKey;
  initializer: PublicKey;
  link: string;
}

export function useUpload() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { devEscrows } = useDevAccounts();

  const uploadWork = useMutation({
    mutationKey: ['uploadWork', { cluster }],
    mutationFn: async ({ escrow, initializer, link }: UploadProps) => {
      const uploadPDA = PublicKey.findProgramAddressSync(
        [Buffer.from('upload'), initializer?.toBuffer(), escrow.toBuffer()],
        program.programId
      )[0];

      if (publicKey) {
        return program.methods
          .uploadWork(link)
          .accounts({
            taker: publicKey,
            initializer: initializer,
            escrowState: escrow,
            uploadWork: uploadPDA,
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

  return { uploadWork };
}
