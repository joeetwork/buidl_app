'use client';

import { BuidlIDL, getBuidlProgramId } from '@buidl/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAnchorProvider } from '@/components/solana/anchor-provider';
import { useCluster } from '@/components/cluster/cluster-data-access';
import base58 from 'bs58';

export function useAccounts() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBuidlProgramId(cluster.network as Cluster),
    [cluster]
  );
  const { publicKey } = useWallet();

  const program = new Program(BuidlIDL, programId, provider);

  interface UserAccountsProps {
    page: number;
    perPage: number;
    role?: string;
  }

  const userAccounts = useMutation({
    mutationKey: ['userAccounts'],
    mutationFn: async ({ page, perPage, role }: UserAccountsProps) => {
      const accountsWithoutData = await provider.connection.getProgramAccounts(
        programId,
        {
          dataSlice: { offset: 0, length: 0 },
          filters: role
            ? [
                {
                  dataSize: 1452,
                  memcmp: {
                    offset: 448,
                    bytes: base58.encode(Buffer.from(role)),
                  },
                },
              ]
            : [
                {
                  dataSize: 1452,
                },
              ],
        }
      );

      const accountPublicKeys = accountsWithoutData.map(
        (account) => account.pubkey
      );

      const paginatedPublicKeys = accountPublicKeys.slice(
        (page - 1) * perPage,
        page * perPage
      );

      if (paginatedPublicKeys.length === 0) {
        return [];
      }

      const users = program.account.user.fetchMultiple(paginatedPublicKeys);

      return users;
    },
  });

  const userAccount = useQuery({
    queryKey: ['userAccount', { publicKey }, { cluster }],
    queryFn: () => {
      if (publicKey) {
        const userPDA = PublicKey.findProgramAddressSync(
          [Buffer.from('user'), publicKey?.toBuffer()],
          program.programId
        )[0];

        return program.account.user.fetch(userPDA);
      }
      return null;
    },
  });

  const devEscrows = useQuery({
    queryKey: ['devEscrows', { publicKey }],
    queryFn: () => {
      if (publicKey) {
        return program.account.escrow.all([
          {
            memcmp: {
              offset: 49,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);
      }
      return null;
    },
  });

  const hiringEscrows = useQuery({
    queryKey: ['hiringEscrows', { publicKey }],
    queryFn: () => {
      if (publicKey) {
        return program.account.escrow.all([
          {
            memcmp: {
              offset: 17,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);
      }
      return null;
    },
  });

  const uploadEmployerHistory = useQuery({
    queryKey: ['uploadEmployerHistory', { publicKey }],
    queryFn: () => {
      if (publicKey) {
        return program.account.upload.all([
          {
            memcmp: {
              offset: 8,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);
      }
      return null;
    },
  });

  const uploadDevHistory = useQuery({
    queryKey: ['uploadDevHistory', { publicKey }],
    queryFn: () => {
      if (publicKey) {
        return program.account.upload.all([
          {
            memcmp: {
              offset: 40,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);
      }
      return null;
    },
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  return {
    program,
    programId,
    getProgramAccount,
    userAccounts,
    userAccount,
    devEscrows,
    hiringEscrows,
    uploadEmployerHistory,
    uploadDevHistory,
  };
}
