'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { useTransactionToast } from '@/hooks/use-transaction-toast';
import { useAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { Metaplex, PublicKey } from '@metaplex-foundation/js';
import * as anchor from '@coral-xyz/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';

interface ValidateProps {
  escrow: PublicKey;
  nftAddress: PublicKey;
}

export function useValidate() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, escrowAccounts } = useAccounts();
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const validate = useMutation({
    mutationKey: ['escrow', 'validate', { cluster }],
    mutationFn: async ({ escrow, nftAddress }: ValidateProps) => {
      if (!publicKey) {
        return Promise.resolve('');
      }

      const nftTokenAccount = await getAssociatedTokenAddress(
        new PublicKey('9GCYpiytVnhXTggEC4tKrAHicfpz6pXBuCuc3X7PeL12'),
        publicKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const metaplex = Metaplex.make(connection);
      const metadataPda = metaplex
        .nfts()
        .pdas()
        .metadata({
          mint: new PublicKey('9GCYpiytVnhXTggEC4tKrAHicfpz6pXBuCuc3X7PeL12'),
        });

      return program.methods
        .validateWork()
        .accounts({
          user: publicKey,
          escrowState: escrow,
          nftMint: new PublicKey(
            '9GCYpiytVnhXTggEC4tKrAHicfpz6pXBuCuc3X7PeL12'
          ),
          nftTokenAccount: nftTokenAccount,
          metadataAccount: metadataPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc({
          skipPreflight: true,
        });
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return escrowAccounts.refetch();
    },
  });

  return { validate };
}
