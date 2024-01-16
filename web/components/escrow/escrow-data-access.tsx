'use client';

import { BuidlIDL, getBuidlProgramId } from '@buidl/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
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
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';

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

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  interface Escrow {
    initializerAmount: number;
  }

  const initialize = useMutation({
    mutationKey: ['escrow', 'initialize', { cluster }],
    mutationFn: async ({ initializerAmount }: Escrow) => {
      // Random Seed
      const randomSeed: anchor.BN = new anchor.BN(Math.floor(10 * 100000000));

      // Determined Seeds
      const stateSeed = 'state';
      const authoritySeed = 'authority';

      // USDC mint address goes here
      const mint = new PublicKey(
        '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
      );

      // Derive PDAs: escrowStateKey, vaultKey, vaultAuthorityKey
      const escrowStateKey = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode(stateSeed)),
          randomSeed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      const vaultAuthorityKey = PublicKey.findProgramAddressSync(
        [Buffer.from(authoritySeed, 'utf-8')],
        program.programId
      )[0];

      const _vaultKey = PublicKey.findProgramAddressSync(
        [
          vaultAuthorityKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )[0];
      const vaultKey = _vaultKey;

      const initializerTokenAccount = await getAssociatedTokenAddress(
        mint,
        publicKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      return program.methods
        .initialize(
          randomSeed,
          new anchor.BN(initializerAmount),
          new anchor.BN(1),
          Keypair.generate().publicKey
        )
        .accounts({
          initializer: publicKey,
          vaultAuthority: vaultAuthorityKey,
          vault: vaultKey,
          mint: mint,
          initializerDepositTokenAccount: initializerTokenAccount,
          escrowState: escrowStateKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
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
      const randomSeed: anchor.BN = new anchor.BN(
        Math.floor(Math.random() * 100000000)
      );

      // Determined Seeds
      const stateSeed = 'state';

      // Derive PDAs: escrowStateKey, vaultKey, vaultAuthorityKey
      const escrowStateKey = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode(stateSeed)),
          randomSeed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      return program.account.escrowState.fetch(escrowStateKey);
    },
  });

  const close = useMutation({
    mutationKey: ['escrow', 'close', { cluster, vault }],
    mutationFn: () => {
      // Determined Seeds
      const authoritySeed = 'authority';

      const vaultAuthorityKey = PublicKey.findProgramAddressSync(
        [Buffer.from(authoritySeed, 'utf-8')],
        program.programId
      )[0];

      const randomSeed: anchor.BN = new anchor.BN(Math.floor(10 * 100000000));

      // Determined Seeds
      const stateSeed = 'state';

      // Derive PDAs: escrowStateKey, vaultKey, vaultAuthorityKey
      const escrowStateKey = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode(stateSeed)),
          randomSeed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      const _vaultKey = PublicKey.findProgramAddressSync(
        [
          vaultAuthorityKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )[0];
      const vaultKey = _vaultKey;

      return program.methods
        .cancel()
        .accounts({
          initializer: publicKey,
          mint: mint,
          initializerDepositTokenAccount:
            escrowAccounts.data[0]?.account.initializerDepositTokenAccount,
          vault: vaultKey,
          vaultAuthority: vaultAuthorityKey,
          escrowState: escrowAccounts.data[0].publicKey,
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
      // Determined Seeds
      const authoritySeed = 'authority';

      const vaultAuthorityKey = PublicKey.findProgramAddressSync(
        [Buffer.from(authoritySeed, 'utf-8')],
        program.programId
      )[0];

      const randomSeed: anchor.BN = new anchor.BN(Math.floor(10 * 100000000));

      // Determined Seeds
      const stateSeed = 'state';

      // Derive PDAs: escrowStateKey, vaultKey, vaultAuthorityKey
      const escrowStateKey = PublicKey.findProgramAddressSync(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode(stateSeed)),
          randomSeed.toArrayLike(Buffer, 'le', 8),
        ],
        program.programId
      )[0];

      const takerTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        mint,
        publicKey,
        true,
        'confirmed',
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const _vaultKey = PublicKey.findProgramAddressSync(
        [
          vaultAuthorityKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      )[0];
      const vaultKey = _vaultKey;

      return program.methods
        .exchange()
        .accounts({
          taker: publicKey,
          initializerDepositTokenMint: mint,
          takerReceiveTokenAccount: takerTokenAccount.address,
          initializerDepositTokenAccount:
            account.data?.initializerDepositTokenAccount,
          initializer: account.data?.initializerKey,
          escrowState: escrowStateKey,
          vault: vaultKey,
          vaultAuthority: vaultAuthorityKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return account.refetch();
    },
  });

  return {
    account,
    close,
    exchange,
  };
}
