'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { useCluster } from '@/components/cluster/cluster-data-access';
import { useProgram } from './get-program';
import { usePathname, useRouter } from 'next/navigation';

export function useAccounts() {
  const { cluster } = useCluster();
  const { program, programId } = useProgram();
  const { publicKey } = useWallet();
  const pathname = usePathname();
  const router = useRouter();

  const userAccounts = useQuery({
    queryKey: ['userAccounts'],
    queryFn: async () => {
      const res = await program.account.user.all();

      return res.length > 0 ? res : [];
    },
  });

  const userAccount = useQuery({
    queryKey: ['userAccount', { publicKey }, { cluster }],
    queryFn: async () => {
      if (publicKey) {
        const userPDA = PublicKey.findProgramAddressSync(
          [Buffer.from('user'), publicKey?.toBuffer()],
          program.programId
        )[0];

        const res = await program.account.user.fetch(userPDA);

        if (pathname === '/requests' && res.role === 'Client') {
          router.push('/');
        }

        return res ?? {};
      }
      return null;
    },
  });

  return {
    program,
    programId,
    userAccounts,
    userAccount,
  };
}

export function useClientAccounts() {
  const { program, programId } = useProgram();
  const { publicKey } = useWallet();

  const clientEscrows = useQuery({
    queryKey: ['clientEscrows', { publicKey }],
    queryFn: async () => {
      if (publicKey) {
        const res = await program.account.escrow.all([
          {
            memcmp: {
              offset: 17,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);

        return res.length > 0 ? res : [];
      }
      return null;
    },
  });

  const uploadClientHistory = useQuery({
    queryKey: ['uploadClientHistory', { publicKey }],
    queryFn: async () => {
      if (publicKey) {
        const res = await program.account.upload.all([
          {
            memcmp: {
              offset: 8,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);

        return res.length > 0 ? res : [];
      }
      return null;
    },
  });

  return {
    program,
    programId,
    clientEscrows,
    uploadClientHistory,
  };
}

export function useDevAccounts() {
  const { program, programId } = useProgram();
  const { publicKey } = useWallet();

  const devEscrows = useQuery({
    queryKey: ['devEscrows', { publicKey }],
    queryFn: async () => {
      if (publicKey) {
        const res = await program.account.escrow.all([
          {
            memcmp: {
              offset: 49,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);

        return res.length > 0 ? res : [];
      }
      return null;
    },
  });

  const uploadDevHistory = useQuery({
    queryKey: ['uploadDevHistory', { publicKey }],
    queryFn: async () => {
      if (publicKey) {
        const res = await program.account.upload.all([
          {
            memcmp: {
              offset: 40,
              bytes: publicKey?.toBase58(),
            },
          },
        ]);

        return res.length > 0 ? res : [];
      }
      return null;
    },
  });

  return {
    program,
    programId,
    devEscrows,
    uploadDevHistory,
  };
}
