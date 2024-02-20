import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { Cluster, Commitment, Connection, Keypair } from '@solana/web3.js';
import base58 from 'bs58';
import * as anchor from '@coral-xyz/anchor';
import { BuidlIDL, getBuidlProgramId } from '@buidl/anchor';
import { Program } from '@coral-xyz/anchor';

export async function POST(req: Request) {
  try {
    const { escrow = '' } = await req.json();

    const programId = getBuidlProgramId('devnet' as Cluster);

    const signer = base58.decode(process.env.SIGNER as string);

    const signerKeypair = Keypair.fromSecretKey(signer);

    const wallet = new NodeWallet(signerKeypair);

    const options = anchor.AnchorProvider.defaultOptions();

    const commitment: Commitment = 'processed'; // processed, confirmed, finalized
    const connection = new Connection('https://api.devnet.solana.com', {
      commitment,
      wsEndpoint: 'https://api.devnet.solana.com',
    });

    const provider = new anchor.AnchorProvider(connection, wallet, options);

    const program = new Program(BuidlIDL, programId, provider);

    await program.methods
      .countVote()
      .accounts({
        escrowState: escrow.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([signerKeypair])
      .rpc({
        skipPreflight: true,
      });

  } catch (err) {
    console.log(err);
  }
}
