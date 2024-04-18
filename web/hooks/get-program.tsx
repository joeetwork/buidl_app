'use client';

import { BuidlIDL, getBuidlProgramId } from '@buidl/anchor';
import { Program } from '@coral-xyz/anchor';
import { Cluster } from '@solana/web3.js';
import { useMemo } from 'react';
import { useAnchorProvider } from '@/components/solana/anchor-provider';
import { useCluster } from '@/components/cluster/cluster-data-access';

export function useProgram() {
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getBuidlProgramId(cluster.network as Cluster),
    [cluster]
  );

  const program = new Program(BuidlIDL, programId, provider);

  return {
    program,
    programId,
  };
}
