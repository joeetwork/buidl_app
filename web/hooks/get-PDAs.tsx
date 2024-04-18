'use client';

import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProgram } from './get-program';

export function usePDAs() {
  const { program } = useProgram();
  const { publicKey } = useWallet();

  const mint = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

  const seed: anchor.BN = new anchor.BN(Math.floor(Math.random() * 100000000));

  const escrowPDA = PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), seed.toArrayLike(Buffer, 'le', 8)],
    program.programId
  )[0];

  const userPDA = publicKey
    ? PublicKey.findProgramAddressSync(
        [Buffer.from('user'), publicKey?.toBuffer()],
        program.programId
      )[0]
    : undefined;

  const vaultPDA = getAssociatedTokenAddressSync(mint, escrowPDA, true);

  return {
    mint,
    seed,
    escrowPDA,
    vaultPDA,
    userPDA,
  };
}
