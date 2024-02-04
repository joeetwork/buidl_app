import { Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import { IDL as BuidlIDL } from '../target/types/anchor_escrow';
import type { AnchorEscrow } from '../target/types/anchor_escrow';

export { AnchorEscrow, BuidlIDL };
export type BuidlProgram = Program<AnchorEscrow>;
export const BUIDL_PROGRAM_ID = new PublicKey(
  '8yPzPyRoGL7kggvv3uf8w7brKCvr8KgjUqvd6SWhhSd1'
);

export function getBuidlProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
      return new PublicKey('8yPzPyRoGL7kggvv3uf8w7brKCvr8KgjUqvd6SWhhSd1');
    default:
      return BUIDL_PROGRAM_ID;
  }
}
