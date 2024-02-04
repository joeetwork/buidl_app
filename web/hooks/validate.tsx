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
  accept: boolean;
  nftAddress?: PublicKey;
}

export function useValidate(collection?: PublicKey) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useAccounts();
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const validatorCollectionEscrows = useQuery({
    queryKey: ['validatorCollectionEscrows', { collection }],
    queryFn: () => {
      if (collection) {
        return program.account.escrow.all([
          {
            memcmp: {
              offset: 122,
              bytes: collection.toBase58(),
            },
          },
        ]);
      }
      return null;
    },
  });

  const validatorUserEscrows = useQuery({
    queryKey: ['validatorUserEscrows', { publicKey }],
    queryFn: () => {
      if (publicKey) {
        return program.account.escrow.all([
          {
            memcmp: {
              offset: 123,
              bytes: publicKey.toBase58(),
            },
          },
        ]);
      }
      return null;
    },
  });

  const validateWithCollection = useMutation({
    mutationKey: ['validateWithCollection', 'validate', { cluster }],
    mutationFn: async ({ escrow, nftAddress, accept }: ValidateProps) => {
      if (publicKey && nftAddress) {
        const validatePDA = PublicKey.findProgramAddressSync(
          [Buffer.from('validate'), publicKey?.toBuffer(), escrow.toBuffer()],
          program.programId
        )[0];

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
          .validateWithCollection(accept)
          .accounts({
            user: publicKey,
            escrowState: escrow,
            nftMint: nftAddress,
            nftTokenAccount: nftTokenAccount,
            metadataAccount: metadataPda,
            validateState: validatePDA,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc({
            skipPreflight: true,
          });
      }
      return null;
    },
    onSuccess: (tx) => {
      transactionToast(tx ?? '');
      return validatorCollectionEscrows.refetch();
    },
  });

  const validateWithUser = useMutation({
    mutationKey: ['validateDecline', 'validate', { cluster }],
    mutationFn: async ({ escrow, accept }: ValidateProps) => {
      if (publicKey) {
        const validatePDA = PublicKey.findProgramAddressSync(
          [Buffer.from('validate'), publicKey?.toBuffer(), escrow.toBuffer()],
          program.programId
        )[0];

        return program.methods
          .validateWithUser(accept)
          .accounts({
            user: publicKey,
            escrowState: escrow,
            validateState: validatePDA,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc({
            skipPreflight: true,
          });
      }
      return null;
    },
    onSuccess: (tx) => {
      transactionToast(tx ?? '');
      return validatorUserEscrows.refetch();
    },
  });

  return {
    validateWithCollection,
    validateWithUser,
    validatorCollectionEscrows,
    validatorUserEscrows,
  };
}
