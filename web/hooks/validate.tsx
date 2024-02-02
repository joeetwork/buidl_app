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

export function useValidate(collection?: PublicKey) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useAccounts();
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

  const validateAccept = useMutation({
    mutationKey: ['validateAccept', 'validate', { cluster }],
    mutationFn: async ({ escrow, nftAddress }: ValidateProps) => {
      if (publicKey) {
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
          .validateAccept()
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
      return validatorEscrows.refetch();
    },
  });

  const validateDecline = useMutation({
    mutationKey: ['validateDecline', 'validate', { cluster }],
    mutationFn: async ({ escrow, nftAddress }: ValidateProps) => {
      if (!publicKey) {
        return Promise.resolve('');
      }

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
        .validateDecline()
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
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return validatorEscrows.refetch();
    },
  });

  return { validateAccept, validateDecline, validatorEscrows };
}
