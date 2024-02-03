'use client';

import { BuidlIDL, getBuidlProgramId } from '@buidl/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAnchorProvider } from '@/components/solana/anchor-provider';
import { useCluster } from '@/components/cluster/cluster-data-access';

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

  const userAccounts = useQuery({
    queryKey: ['userAccounts'],
    queryFn: () => {
      return program.account.user.all();
    },
  });

  const userAccount = useQuery({
    queryKey: ['userAccount'],
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

  const uploadHistory = useQuery({
    queryKey: ['uploadHistory', {publicKey}],
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
    uploadHistory
  };
}
