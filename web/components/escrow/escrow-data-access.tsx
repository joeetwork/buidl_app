'use client';

import { BuidlIDL, getBuidlProgramId } from '@buidl/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey, SystemProgram } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import * as anchor from '@coral-xyz/anchor';

import { useAnchorProvider } from '../solana/anchor-provider';
import { useTransactionToast } from '@/hooks/use-transaction-toast';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { Metaplex } from '@metaplex-foundation/js';

export function useEscrowProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBuidlProgramId(cluster.network as Cluster),
    [cluster]
  );
  const { publicKey } = useWallet();

  const program = new Program(BuidlIDL, programId, provider);
  const escrowAccounts = useQuery({
    queryKey: ['escrow', 'all', { cluster }],
    queryFn: () => program.account.escrowState.all(),
  });

  const userAccounts = useQuery({
    queryKey: ['escrow', 'fetch', { cluster }],
    queryFn: () => {
      const userPDA = PublicKey.findProgramAddressSync(
        [Buffer.from('user'), publicKey?.toBuffer()],
        program.programId
      )[0];

      return program.account.userState.fetch(userPDA);
    },
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initializeUser = useMutation({
    mutationKey: ['escrow', 'initializeUser', { cluster }],
    mutationFn: async (name: string) => {
      const userPDA = PublicKey.findProgramAddressSync(
        [Buffer.from('user'), publicKey?.toBuffer()],
        program.programId
      )[0];

      return program.methods
        .initializeUser(name)
        .accounts({
          initializer: publicKey,
          userState: userPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return userAccounts.refetch();
    },
    onError: () => toast.error('Failed to initialize counter'),
  });

  const initialize = useMutation({
    mutationKey: ['escrow', 'initialize', { cluster }],
    mutationFn: async (initializerAmount: number) => {
      // USDC mint address goes here
      const mint = new PublicKey(
        '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
      );

      // Random Seed
      const seed: anchor.BN = new anchor.BN(
        Math.floor(Math.random() * 100000000)
      );

      const escrow = PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), seed.toArrayLike(Buffer, 'le', 8)],
        program.programId
      )[0];

      const vault = getAssociatedTokenAddressSync(mint, escrow, true);

      const initializerTokenAccount = await getAssociatedTokenAddress(
        mint,
        publicKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      return program.methods
        .initialize(
          seed,
          new anchor.BN(initializerAmount),
          new anchor.BN(1),
          new PublicKey('F17gXajNLmVdMXtCPVpJ8enhwoxtscmDf7fLoJE8vUgw'),
          new PublicKey('9ifBnWRecQxF3b4UfqEWp2pw7a6UAVBYiDfYYB7UtFq2')
        )
        .accounts({
          initializer: publicKey,
          vault: vault,
          mint: mint,
          initializerDepositTokenAccount: initializerTokenAccount,
          escrowState: escrow,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return escrowAccounts.refetch();
    },
    onError: () => toast.error('Failed to initialize counter'),
  });

  return {
    program,
    programId,
    escrowAccounts,
    getProgramAccount,
    initialize,
    initializeUser,
    userAccounts,
  };
}

export function useEscrowProgramAccount({ vault }: { vault: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, escrowAccounts } = useEscrowProgram();
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // USDC mint address goes here
  const mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

  const account = useQuery({
    queryKey: ['escrow', 'fetch', { cluster }],
    queryFn: () => {
      const seed: anchor.BN = new anchor.BN(
        Math.floor(Math.random() * 100000000)
      );

      // Determined Seeds
      const stateSeed = 'escrow';

      // Derive PDAs: escrowStateKey, vaultKey, vaultAuthorityKey
      const escrowStateKey = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode(stateSeed)),
          seed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      return program.account.escrowState.fetch(escrowStateKey);
    },
  });

  const declineRequest = useMutation({
    mutationKey: ['escrow', 'declineRequest', { cluster, vault }],
    mutationFn: () => {
      const escrow = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('escrow')),
          escrowAccounts.data[1]?.account.seed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      vault = getAssociatedTokenAddressSync(mint, escrow, true);

      const initializerDepositTokenAccount = getAssociatedTokenAddressSync(
        mint,
        escrowAccounts.data[1].account.initializer,
        true
      );

      return program.methods
        .declineRequest()
        .accounts({
          taker: publicKey,
          initializer: escrowAccounts.data[1].account.initializer,
          mint: mint,
          initializerDepositTokenAccount: initializerDepositTokenAccount,
          vault: vault,
          escrowState: escrow,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return escrowAccounts.refetch();
    },
  });

  const close = useMutation({
    mutationKey: ['escrow', 'close', { cluster, vault }],
    mutationFn: () => {
      const escrow = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('escrow')),
          escrowAccounts.data[0]?.account.seed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      vault = getAssociatedTokenAddressSync(mint, escrow, true);

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
  });

  const exchange = useMutation({
    mutationKey: ['escrow', 'exchange', { cluster, vault }],
    mutationFn: async () => {
      const escrow = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('escrow')),
          escrowAccounts.data[1]?.account.seed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      vault = getAssociatedTokenAddressSync(mint, escrow, true);

      const takerTokenAccount = await getAssociatedTokenAddress(
        mint,
        publicKey,
        true
      );

      return program.methods
        .exchange()
        .accounts({
          taker: publicKey,
          mint: mint,
          takerReceiveTokenAccount: takerTokenAccount,
          initializer: escrowAccounts.data[0]?.account.initializer,
          escrowState: escrow,
          vault: vault,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return account.refetch();
    },
  });

  const validate = useMutation({
    mutationKey: ['escrow', 'validate', { cluster }],
    mutationFn: async () => {
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

      const escrow = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode('escrow')),
          escrowAccounts.data[1]?.account.seed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

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

  return {
    account,
    close,
    exchange,
    validate,
    declineRequest,
  };
}
