import { Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import { IDL as BuidlIDL } from '../target/types/anchor_escrow';
import type { AnchorEscrow } from '../target/types/anchor_escrow';

export { AnchorEscrow, BuidlIDL };
export type BuidlProgram = Program<AnchorEscrow>;
export const BUIDL_PROGRAM_ID = new PublicKey(
  '4wyUbUA2f3rzLTrT8PFvYYv1dEqbd46QbSswua85UdVm'
);

export function getBuidlProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
      return new PublicKey('4wyUbUA2f3rzLTrT8PFvYYv1dEqbd46QbSswua85UdVm');
    default:
      return BUIDL_PROGRAM_ID;
  }
}
