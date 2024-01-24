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

  const escrowAccounts = useQuery({
    queryKey: ['escrow', 'all', { cluster }],
    queryFn: () => program.account.escrow.all(),
  });

  const userAccounts = useQuery({
    queryKey: ['user', 'fetch', { cluster }],
    queryFn: () => {
      return program.account.user.all();
    },
  });

  const userRequests = useQuery({
    queryKey: ['escrow', 'all', { cluster }],
    queryFn: () => {
      if (!publicKey) {
        return Promise.resolve(undefined);
      }

      return program.account.escrow.all([
        {
          memcmp: {
            offset: 17,
            bytes: publicKey?.toBase58(),
          },
        },
      ]);
    },
  });

  const userAccount = useQuery({
    queryKey: ['escrow', 'fetch', { cluster }],
    queryFn: () => {
      if (!publicKey) {
        return Promise.resolve(undefined);
      }

      const userPDA = PublicKey.findProgramAddressSync(
        [Buffer.from('user'), publicKey?.toBuffer()],
        program.programId
      )[0];

      return program.account.user.fetch(userPDA);
    },
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  return {
    program,
    programId,
    escrowAccounts,
    getProgramAccount,
    userAccounts,
    userAccount,
    userRequests,
  };
}
