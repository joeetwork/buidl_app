'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTransactionToast } from '@/components/shared/use-transaction-toast';
import { useClientAccounts } from './get-accounts';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { Metaplex, PublicKey } from '@metaplex-foundation/js';
import * as anchor from '@coral-xyz/anchor';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { useProgram } from './get-program';
import { useCollection } from './get-collection';

interface ValidateProps {
  escrow: PublicKey;
  nftAddress?: PublicKey;
}

export function useValidateUser() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useProgram();
  const { publicKey } = useWallet();

  const validatorUserEscrows = useQuery({
    queryKey: ['validatorUserEscrows', { publicKey }],
    queryFn: async () => {
      if (publicKey) {
        const res = await program.account.escrow.all([
          {
            memcmp: {
              offset: 123,
              bytes: publicKey.toBase58(),
            },
          },
        ]);
        return res.length > 0 ? res : [];
      }
      return null;
    },
  });

  const acceptWithUser = useMutation({
    mutationKey: ['acceptWithUser', 'validate', { cluster }],
    mutationFn: async ({ escrow }: ValidateProps) => {
      if (publicKey) {
        const validatePDA = PublicKey.findProgramAddressSync(
          [Buffer.from('validate'), publicKey?.toBuffer(), escrow.toBuffer()],
          program.programId
        )[0];

        return program.methods
          .acceptWithUser()
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

  const declineWithUser = useMutation({
    mutationKey: ['declineWithUser', 'validate', { cluster }],
    mutationFn: async ({ escrow }: ValidateProps) => {
      if (publicKey) {
        const validatePDA = PublicKey.findProgramAddressSync(
          [Buffer.from('validate'), publicKey?.toBuffer(), escrow.toBuffer()],
          program.programId
        )[0];

        return program.methods
          .declineWithUser()
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

  const countVote = useQuery({
    queryKey: ['countVote', { validatorUserEscrows }],
    queryFn: async () => {
      validatorUserEscrows.data?.forEach((escrow) => {
        if (
          escrow.account.status === 'validate' &&
          escrow.account.voteDeadline &&
          escrow.account.voteDeadline.toNumber() < new Date().getTime() / 1000
        ) {
          fetch('/api/signer', {
            method: 'POST',
            body: JSON.stringify({
              escrow: escrow,
            }),
          });
          validatorUserEscrows.refetch();
        }
      });
    },
  });

  return {
    acceptWithUser,
    declineWithUser,
    validatorUserEscrows,
    countVote,
  };
}

export function useValidateClient() {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { clientEscrows } = useClientAccounts();

  const validateWithClient = useMutation({
    mutationKey: ['validateWithClient', { cluster }],
    mutationFn: async (escrow: PublicKey) => {
      if (publicKey) {
        const validatePDA = PublicKey.findProgramAddressSync(
          [Buffer.from('validate'), publicKey?.toBuffer(), escrow.toBuffer()],
          program.programId
        )[0];

        return program.methods
          .validateWithEmployer()
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
      return clientEscrows.refetch();
    },
  });

  const countVote = useQuery({
    queryKey: ['countVote'],
    queryFn: async () => {
      clientEscrows.data?.forEach((escrow) => {
        if (
          escrow.account.status === 'validate' &&
          escrow.account.voteDeadline &&
          escrow.account.voteDeadline.toNumber() < new Date().getTime() / 1000
        ) {
          fetch('/api/signer', {
            method: 'POST',
            body: JSON.stringify({
              escrow: escrow,
            }),
          });
          clientEscrows.refetch();
        }
      });
    },
  });

  return {
    validateWithClient,
    countVote,
  };
}

export function useValidateCollection({
  collection,
  contract,
}: {
  collection?: PublicKey | null;
  contract?: PublicKey | null;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { collections } = useCollection(collection);

  const validatorCollectionEscrows = useQuery({
    queryKey: ['validatorCollectionEscrows', { collection }],
    queryFn: async () => {
      if (collection) {
        const res = await program.account.escrow.all([
          {
            memcmp: {
              offset: 122,
              bytes: collection.toBase58(),
            },
          },
        ]);
        return res.length > 0 ? res : [];
      }
      return null;
    },
  });

  const validatorCollectionEscrow = useQuery({
    queryKey: ['validatorCollectionEscrows', { contract }],
    queryFn: async () => {
      if (contract) {
        return await program.account.escrow.fetch(contract);
      }
      return null;
    },
  });

  const acceptWithCollection = useMutation({
    mutationKey: ['acceptWithCollection', 'validate', { cluster }],
    mutationFn: async ({ escrow, nftAddress }: ValidateProps) => {
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
          .acceptWithCollection()
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

  const declineWithCollection = useMutation({
    mutationKey: ['declineWithCollection', 'validate', { cluster }],
    mutationFn: async ({ escrow, nftAddress }: ValidateProps) => {
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
          .declineWithCollection()
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

  // const countVote = useQuery({
  //   queryKey: ['countVote', { validatorCollectionEscrows }],
  //   queryFn: async () => {
  //     validatorCollectionEscrows.data?.forEach((escrow) => {
  //       if (
  //         escrow.account.status === 'validate' &&
  //         escrow.account.voteDeadline &&
  //         escrow.account.voteDeadline.toNumber() < new Date().getTime() / 1000
  //       ) {
  //         fetch('/api/signer', {
  //           method: 'POST',
  //           body: JSON.stringify({
  //             escrow: escrow,
  //           }),
  //         });
  //         validatorCollectionEscrows.refetch();
  //       }
  //     });
  //   },
  // });

  return {
    acceptWithCollection,
    declineWithCollection,
    validatorCollectionEscrows,
    validatorCollectionEscrow,
    collections,
    // countVote,
  };
}
