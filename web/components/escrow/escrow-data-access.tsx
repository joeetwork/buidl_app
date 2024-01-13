'use client';

import { BuidlIDL, getBuidlProgramId } from '@buidl/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import * as anchor from '@coral-xyz/anchor';

import { useAnchorProvider } from '../solana/anchor-provider';
import { useTransactionToast } from '@/hooks/use-transaction-toast';

export function useEscrowProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBuidlProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(BuidlIDL, programId, provider);

  const escrowAccounts = useQuery({
    queryKey: ['escrow', 'all', { cluster }],
    queryFn: () => program.account.escrowState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  // Random Seed
  const randomSeed: anchor.BN = new anchor.BN(
    Math.floor(Math.random() * 100000000)
  );

  interface Escrow {
    keypair: Keypair;
    initializerAmount: number;
    takerAmount: number;
    vaultAuthorityKey: PublicKey;
    vaultKey: PublicKey;
    mintA: PublicKey;
    initializerTokenAccountA: PublicKey;
    initializerTokenAccountB: PublicKey;
    escrowStateKey: PublicKey;
    TOKEN_PROGRAM_ID: PublicKey;
  }

  const initialize = useMutation({
    mutationKey: ['escrow', 'initialize', { cluster }],
    mutationFn: ({
      keypair,
      initializerAmount,
      takerAmount,
      vaultAuthorityKey,
      vaultKey,
      mintA,
      initializerTokenAccountA,
      initializerTokenAccountB,
      escrowStateKey,
      TOKEN_PROGRAM_ID,
    }: Escrow) =>
      program.methods
        .initialize(
          randomSeed,
          new anchor.BN(initializerAmount),
          new anchor.BN(takerAmount),
          new anchor.BN(1)
        )
        .accounts({
          initializer: keypair.publicKey,
          vaultAuthority: vaultAuthorityKey,
          vault: vaultKey,
          mint: mintA,
          initializerDepositTokenAccount: initializerTokenAccountA,
          initializerReceiveTokenAccount: initializerTokenAccountB,
          escrowState: escrowStateKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([keypair])
        .rpc(),
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

  const account = useQuery({
    queryKey: ['escrow', 'fetch', { cluster, vault }],
    queryFn: () => program.account.escrowState.fetch(vault),
  });

  const close = useMutation({
    mutationKey: ['escrow', 'close', { cluster, vault }],
    mutationFn: () => program.methods.cancel().accounts({ vault }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return escrowAccounts.refetch();
    },
  });

  const exchange = useMutation({
    mutationKey: ['escrow', 'exchange', { cluster, vault }],
    mutationFn: () => program.methods.exchange().accounts({ vault }).rpc(),
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
