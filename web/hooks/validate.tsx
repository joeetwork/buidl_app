'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
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

export function useValidate(collection: PublicKey) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, escrowAccounts } = useAccounts();
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const validatorEscrows = useQuery({
    queryKey: ['validateEscrow', { collection }],
    queryFn: () => {
      if (collection) {
        return program.account.escrow.all([
          {
            memcmp: {
              offset: 121,
              bytes: collection.toBase58(),
            },
          },
        ]);
      }
      return null;
    },
  });

  const validate = useMutation({
    mutationKey: ['validator', 'validate', { cluster }],
    mutationFn: async ({ escrow, nftAddress }: ValidateProps) => {
      if (!publicKey) {
        return Promise.resolve('');
      }

      const nftTokenAccount = await getAssociatedTokenAddress(
        nftAddress,
        publicKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const metaplex = Metaplex.make(connection);
      const metadataPda = metaplex.nfts().pdas().metadata({
        mint: nftAddress,
      });

      return program.methods
        .validateWork()
        .accounts({
          user: publicKey,
          escrowState: escrow,
          nftMint: nftAddress,
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

  return { validate, validatorEscrows };
}
