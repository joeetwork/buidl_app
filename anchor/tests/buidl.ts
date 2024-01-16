import * as anchor from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { IDL } from '../target/types/anchor_escrow';
import {
  PublicKey,
  SystemProgram,
  Connection,
  Commitment,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
} from '@solana/spl-token';
import { assert } from 'chai';
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  CreateMetadataAccountArgsV3,
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
  createSetCollectionSizeInstruction,
} from '@metaplex-foundation/mpl-token-metadata';

describe('anchor-escrow', () => {
  // Use Mainnet-fork for testing
  const commitment: Commitment = 'processed'; // processed, confirmed, finalized
  const connection = new Connection('http://localhost:8899', {
    commitment,
    wsEndpoint: 'ws://localhost:8900/',
  });
  // const connection = new Connection("https://api.devnet.solana.com", {
  //   commitment,
  //   wsEndpoint: "wss://api.devnet.solana.com/",
  // });

  const options = anchor.AnchorProvider.defaultOptions();
  const wallet = NodeWallet.local();
  const provider = new anchor.AnchorProvider(connection, wallet, options);

  anchor.setProvider(provider);

  // CAUTION: if you are intended to use the program that is deployed by yourself,
  // please make sure that the programIDs are consistent
  const programId = new PublicKey(
    'AmaFf9hFpemKXPaAPqxu14vGaZWcGu1ADN1vpy1gtJtw'
  );
  const program = new anchor.Program(IDL, programId, provider);

  let mint = null as PublicKey;
  let initializerTokenAccount = null as PublicKey;
  let takerTokenAccount = null as PublicKey;

  const initializerAmount = 500;

  // Main Roles
  const payer = anchor.web3.Keypair.generate();
  const mintAuthority = anchor.web3.Keypair.generate();
  const initializer = anchor.web3.Keypair.generate();
  const taker = anchor.web3.Keypair.generate();

  // Determined Seeds
  const stateSeed = 'state';
  const authoritySeed = 'authority';

  // Random Seed
  const randomSeed: anchor.BN = new anchor.BN(
    Math.floor(Math.random() * 100000000)
  );

  // Derive PDAs: escrowStateKey, vaultKey, vaultAuthorityKey
  const escrowStateKey = PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode(stateSeed)),
      randomSeed.toArrayLike(Buffer, 'le', 8),
    ],
    program.programId
  )[0];

  const vaultAuthorityKey = PublicKey.findProgramAddressSync(
    [Buffer.from(authoritySeed, 'utf-8')],
    program.programId
  )[0];
  let vaultKey = null as PublicKey;

  it('Initialize program state', async () => {
    // 1. Airdrop 1 SOL to payer
    const signature = await provider.connection.requestAirdrop(
      payer.publicKey,
      1000000000
    );
    const latestBlockhash = await connection.getLatestBlockhash();
    await provider.connection.confirmTransaction(
      {
        signature,
        ...latestBlockhash,
      },
      commitment
    );

    // 2. Fund main roles: initializer and taker
    const fundingTxMessageV0 = new TransactionMessage({
      payerKey: payer.publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: [
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: initializer.publicKey,
          lamports: 100000000,
        }),
        SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: taker.publicKey,
          lamports: 100000000,
        }),
      ],
    }).compileToV0Message();
    const fundingTx = new VersionedTransaction(fundingTxMessageV0);
    fundingTx.sign([payer]);

    // console.log(Buffer.from(fundingTx.serialize()).toString("base64"));
    const result = await connection.sendRawTransaction(fundingTx.serialize());
    console.log(
      `https://solana.fm/tx/${result}?cluster=http%253A%252F%252Flocalhost%253A8899%252F`
    );

    // 3. Create dummy token mints: mint
    mint = await createMint(
      connection,
      payer,
      mintAuthority.publicKey,
      null,
      0
    );

    // 4. Create token accounts for dummy token mints and both main roles
    initializerTokenAccount = await createAccount(
      connection,
      initializer,
      mint,
      initializer.publicKey
    );
    takerTokenAccount = await createAccount(
      connection,
      taker,
      mint,
      taker.publicKey
    );

    // 5. Mint dummy tokens to initializerTokenAccount
    await mintTo(
      connection,
      initializer,
      mint,
      initializerTokenAccount,
      mintAuthority,
      initializerAmount
    );

    const fetchedInitializerTokenAccount = await getAccount(
      connection,
      initializerTokenAccount
    );

    assert.ok(
      Number(fetchedInitializerTokenAccount.amount) == initializerAmount
    );
  });

  it('Initialize escrow', async () => {
    const _vaultKey = PublicKey.findProgramAddressSync(
      [
        vaultAuthorityKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )[0];
    vaultKey = _vaultKey;

    const result = await program.methods
      .initialize(
        randomSeed,
        new anchor.BN(initializerAmount),
        new anchor.BN(0),
        taker.publicKey
      )
      .accounts({
        initializer: initializer.publicKey,
        vaultAuthority: vaultAuthorityKey,
        vault: vaultKey,
        mint: mint,
        initializerDepositTokenAccount: initializerTokenAccount,
        escrowState: escrowStateKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([initializer])
      .rpc();
    console.log(
      `https://solana.fm/tx/${result}?cluster=http%253A%252F%252Flocalhost%253A8899%252F`
    );

    let fetchedVault = await getAccount(connection, vaultKey);
    let fetchedEscrowState = await program.account.escrowState.fetch(
      escrowStateKey
    );

    // Check that the new owner is the PDA.
    assert.ok(fetchedVault.owner.equals(vaultAuthorityKey));

    // Check that the values in the escrow account match what we expect.
    assert.ok(fetchedEscrowState.initializerKey.equals(initializer.publicKey));
    assert.ok(
      fetchedEscrowState.initializerAmount.toNumber() == initializerAmount
    );
    assert.ok(
      fetchedEscrowState.initializerDepositTokenAccount.equals(
        initializerTokenAccount
      )
    );
  });

//   it('Exchange escrow state', async () => {
//     const result = await program.methods
//       .exchange()
//       .accounts({
//         taker: taker.publicKey,
//         initializerDepositTokenMint: mint,
//         takerReceiveTokenAccount: takerTokenAccount,
//         initializerDepositTokenAccount: initializerTokenAccount,
//         initializer: initializer.publicKey,
//         escrowState: escrowStateKey,
//         vault: vaultKey,
//         vaultAuthority: vaultAuthorityKey,
//         tokenProgram: TOKEN_PROGRAM_ID,
//       })
//       .signers([taker])
//       .rpc();
//     console.log(
//       `https://solana.fm/tx/${result}?cluster=http%253A%252F%252Flocalhost%253A8899%252F`
//     );

//     let fetchedInitializerTokenAccount = await getAccount(
//       connection,
//       initializerTokenAccount
//     );
//     let fetchedTakerTokenAccount = await getAccount(
//       connection,
//       takerTokenAccount
//     );

//     assert.ok(Number(fetchedTakerTokenAccount.amount) == initializerAmount);
//     assert.ok(Number(fetchedInitializerTokenAccount.amount) == 0);
//   });

  it('Initialize escrow and cancel escrow', async () => {
      // Put back tokens into initializer token A account.
    //   await mintTo(
    //       connection,
    //       initializer,
    //       mint,
    //       initializerTokenAccount,
    //       mintAuthority,
    //       initializerAmount
    //   );

    //   const initializedTx = await program.methods
    //   .initialize(
    //     randomSeed,
    //     new anchor.BN(initializerAmount),
    //     new anchor.BN(0),
    //     taker.publicKey
    //   )
    //   .accounts({
    //     initializer: initializer.publicKey,
    //     vaultAuthority: vaultAuthorityKey,
    //     vault: vaultKey,
    //     mint: mint,
    //     initializerDepositTokenAccount: initializerTokenAccount,
    //     escrowState: escrowStateKey,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //   })
    //   .signers([initializer])
    //   .rpc();
    //   console.log(
    //       `https://solana.fm/tx/${initializedTx}?cluster=http%253A%252F%252Flocalhost%253A8899%252F`
    //   );

    //   Cancel the escrow.
      const canceledTX = await program.methods
          .cancel()
          .accounts({
              initializer: initializer.publicKey,
              mint: mint,
              initializerDepositTokenAccount: initializerTokenAccount,
              vault: vaultKey,
              vaultAuthority: vaultAuthorityKey,
              escrowState: escrowStateKey,
              tokenProgram: TOKEN_PROGRAM_ID,
          })
          .signers([initializer])
          .rpc();
      console.log(
          `https://solana.fm/tx/${canceledTX}?cluster=http%253A%252F%252Flocalhost%253A8899%252F`
      );

      // Check the final owner should be the provider public key.
      const fetchedInitializerTokenAccountA = await getAccount(
          connection,
          initializerTokenAccount
      );

      assert.ok(
          fetchedInitializerTokenAccountA.owner.equals(initializer.publicKey)
      );
      // Check all the funds are still there.
      assert.ok(
          Number(fetchedInitializerTokenAccountA.amount) == initializerAmount
      );
  });

  //     it('Mint NFT', async () => {
  //       const verifiedUser = anchor.web3.Keypair.generate();

  //       // 1. Airdrop 1 SOL to payer
  //       const signature = await provider.connection.requestAirdrop(
  //           verifiedUser.publicKey,
  //           1000000000
  //       );
  //       const latestBlockhash = await connection.getLatestBlockhash();
  //       await provider.connection.confirmTransaction(
  //           {
  //               signature,
  //               ...latestBlockhash,
  //           },
  //           commitment
  //       );

  //       /**
  //        * Create an NFT collection on-chain, using the regular Metaplex standards
  //        * with the `payer` as the authority
  //        */
  //       async function createCollection(
  //           connection: Connection,
  //           payer: anchor.web3.Keypair,
  //           metadataV3: CreateMetadataAccountArgsV3
  //       ) {
  //           // create and initialize the SPL token mint
  //           console.log("Creating the collection's mint...");
  //           const mint = await createMint(
  //               connection,
  //               payer,
  //               // mint authority
  //               payer.publicKey,
  //               // freeze authority
  //               payer.publicKey,
  //               // decimals - use `0` for NFTs since they are non-fungible
  //               0
  //           );
  //           console.log('Mint address:', mint.toBase58());

  //           // create the token account
  //           console.log('Creating a token account...');
  //           const tokenAccount = await createAccount(
  //               connection,
  //               payer,
  //               mint,
  //               payer.publicKey,
  //               undefined,
  //               {
  //                   skipPreflight: true,
  //               }
  //           );
  //           console.log('Token account:', tokenAccount.toBase58());

  //           // mint 1 token ()
  //           console.log('Minting 1 token for the collection...');
  //           const mintSig = await mintTo(
  //               connection,
  //               payer,
  //               mint,
  //               tokenAccount,
  //               payer,
  //               // mint exactly 1 token
  //               1,
  //               // no `multiSigners`
  //               [],
  //               {
  //                   skipPreflight: true,
  //               },
  //               TOKEN_PROGRAM_ID
  //           );
  //           // console.log(explorerURL({ txSignature: mintSig }));

  //           // derive the PDA for the metadata account
  //           const [metadataAccount, _bump] = PublicKey.findProgramAddressSync(
  //               [
  //                   Buffer.from('metadata', 'utf8'),
  //                   TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  //                   mint.toBuffer(),
  //               ],
  //               TOKEN_METADATA_PROGRAM_ID
  //           );
  //           console.log('Metadata account:', metadataAccount.toBase58());

  //           // create an instruction to create the metadata account
  //           const createMetadataIx = createCreateMetadataAccountV3Instruction(
  //               {
  //                   metadata: metadataAccount,
  //                   mint: mint,
  //                   mintAuthority: payer.publicKey,
  //                   payer: payer.publicKey,
  //                   updateAuthority: payer.publicKey,
  //               },
  //               {
  //                   createMetadataAccountArgsV3: metadataV3,
  //               }
  //           );

  //           // derive the PDA for the metadata account
  //           const [masterEditionAccount, _bump2] =
  //               PublicKey.findProgramAddressSync(
  //                   [
  //                       Buffer.from('metadata', 'utf8'),
  //                       TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  //                       mint.toBuffer(),
  //                       Buffer.from('edition', 'utf8'),
  //                   ],
  //                   TOKEN_METADATA_PROGRAM_ID
  //               );
  //           console.log(
  //               'Master edition account:',
  //               masterEditionAccount.toBase58()
  //           );

  //           // create an instruction to create the metadata account
  //           const createMasterEditionIx =
  //               createCreateMasterEditionV3Instruction(
  //                   {
  //                       edition: masterEditionAccount,
  //                       mint: mint,
  //                       mintAuthority: payer.publicKey,
  //                       payer: payer.publicKey,
  //                       updateAuthority: payer.publicKey,
  //                       metadata: metadataAccount,
  //                   },
  //                   {
  //                       createMasterEditionArgs: {
  //                           maxSupply: 0,
  //                       },
  //                   }
  //               );

  //           // create the collection size instruction
  //           const collectionSizeIX = createSetCollectionSizeInstruction(
  //               {
  //                   collectionMetadata: metadataAccount,
  //                   collectionAuthority: payer.publicKey,
  //                   collectionMint: mint,
  //               },
  //               {
  //                   setCollectionSizeArgs: { size: 1 },
  //               }
  //           );

  //           try {
  //               // construct the transaction with our instructions, making the `payer` the `feePayer`
  //               const tx = new anchor.web3.Transaction()
  //                   .add(createMetadataIx)
  //                   .add(createMasterEditionIx)
  //                   .add(collectionSizeIX);
  //               tx.feePayer = payer.publicKey;

  //               // send the transaction to the cluster
  //               const txSignature = await anchor.web3.sendAndConfirmTransaction(
  //                   connection,
  //                   tx,
  //                   [payer],
  //                   {
  //                       commitment: 'confirmed',
  //                       skipPreflight: true,
  //                   }
  //               );

  //               console.log('\nCollection successfully created!');
  //           } catch (err) {
  //               console.error('\nFailed to create collection:', err);

  //               throw err;
  //           }

  //           // return all the accounts
  //           return {
  //               mint,
  //               tokenAccount,
  //               metadataAccount,
  //               masterEditionAccount,
  //           };
  //       }

  //       const metadataV3 = {
  //           data: {
  //               name: 'string',
  //               symbol: 'string',
  //               uri: 'string',
  //               sellerFeeBasisPoints: 0,
  //               creators: null,
  //               collection: {
  //                   verified: true,
  //                   key: new PublicKey(
  //                       'F17gXajNLmVdMXtCPVpJ8enhwoxtscmDf7fLoJE8vUgw'
  //                   ),
  //               },
  //               uses: null,
  //           },
  //           isMutable: true,
  //           collectionDetails: null,
  //       };

  //       const { mint, tokenAccount, metadataAccount } = await createCollection(
  //           connection,
  //           verifiedUser,
  //           metadataV3
  //       );

  //   });

  // it('Initialize escrow, validate work and then exchange', async () => {
  //     const verifiedUser = anchor.web3.Keypair.generate();

  //     // 1. Airdrop 1 SOL to payer
  //     const signature = await provider.connection.requestAirdrop(
  //         verifiedUser.publicKey,
  //         1000000000
  //     );
  //     const latestBlockhash = await connection.getLatestBlockhash();
  //     await provider.connection.confirmTransaction(
  //         {
  //             signature,
  //             ...latestBlockhash,
  //         },
  //         commitment
  //     );

  //     /**
  //      * Create an NFT collection on-chain, using the regular Metaplex standards
  //      * with the `payer` as the authority
  //      */
  //     async function createCollection(
  //         connection: Connection,
  //         payer: anchor.web3.Keypair,
  //         metadataV3: CreateMetadataAccountArgsV3
  //     ) {
  //         // create and initialize the SPL token mint
  //         console.log("Creating the collection's mint...");
  //         const mint = await createMint(
  //             connection,
  //             payer,
  //             // mint authority
  //             payer.publicKey,
  //             // freeze authority
  //             payer.publicKey,
  //             // decimals - use `0` for NFTs since they are non-fungible
  //             0
  //         );
  //         console.log('Mint address:', mint.toBase58());

  //         // create the token account
  //         console.log('Creating a token account...');
  //         const tokenAccount = await createAccount(
  //             connection,
  //             payer,
  //             mint,
  //             payer.publicKey,
  //             undefined,
  //             {
  //                 skipPreflight: true,
  //             }
  //         );
  //         console.log('Token account:', tokenAccount.toBase58());

  //         // mint 1 token ()
  //         console.log('Minting 1 token for the collection...');
  //         const mintSig = await mintTo(
  //             connection,
  //             payer,
  //             mint,
  //             tokenAccount,
  //             payer,
  //             // mint exactly 1 token
  //             1,
  //             // no `multiSigners`
  //             [],
  //             {
  //                 skipPreflight: true,
  //             },
  //             TOKEN_PROGRAM_ID
  //         );
  //         // console.log(explorerURL({ txSignature: mintSig }));

  //         // derive the PDA for the metadata account
  //         const [metadataAccount, _bump] = PublicKey.findProgramAddressSync(
  //             [
  //                 Buffer.from('metadata', 'utf8'),
  //                 TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  //                 mint.toBuffer(),
  //             ],
  //             TOKEN_METADATA_PROGRAM_ID
  //         );
  //         console.log('Metadata account:', metadataAccount.toBase58());

  //         // create an instruction to create the metadata account
  //         const createMetadataIx = createCreateMetadataAccountV3Instruction(
  //             {
  //                 metadata: metadataAccount,
  //                 mint: mint,
  //                 mintAuthority: payer.publicKey,
  //                 payer: payer.publicKey,
  //                 updateAuthority: payer.publicKey,
  //             },
  //             {
  //                 createMetadataAccountArgsV3: metadataV3,
  //             }
  //         );

  //         // derive the PDA for the metadata account
  //         const [masterEditionAccount, _bump2] =
  //             PublicKey.findProgramAddressSync(
  //                 [
  //                     Buffer.from('metadata', 'utf8'),
  //                     TOKEN_METADATA_PROGRAM_ID.toBuffer(),
  //                     mint.toBuffer(),
  //                     Buffer.from('edition', 'utf8'),
  //                 ],
  //                 TOKEN_METADATA_PROGRAM_ID
  //             );
  //         console.log(
  //             'Master edition account:',
  //             masterEditionAccount.toBase58()
  //         );

  //         // create an instruction to create the metadata account
  //         const createMasterEditionIx =
  //             createCreateMasterEditionV3Instruction(
  //                 {
  //                     edition: masterEditionAccount,
  //                     mint: mint,
  //                     mintAuthority: payer.publicKey,
  //                     payer: payer.publicKey,
  //                     updateAuthority: payer.publicKey,
  //                     metadata: metadataAccount,
  //                 },
  //                 {
  //                     createMasterEditionArgs: {
  //                         maxSupply: 0,
  //                     },
  //                 }
  //             );

  //         // create the collection size instruction
  //         const collectionSizeIX = createSetCollectionSizeInstruction(
  //             {
  //                 collectionMetadata: metadataAccount,
  //                 collectionAuthority: payer.publicKey,
  //                 collectionMint: mint,
  //             },
  //             {
  //                 setCollectionSizeArgs: { size: 1 },
  //             }
  //         );

  //         try {
  //             // construct the transaction with our instructions, making the `payer` the `feePayer`
  //             const tx = new anchor.web3.Transaction()
  //                 .add(createMetadataIx)
  //                 .add(createMasterEditionIx)
  //                 .add(collectionSizeIX);
  //             tx.feePayer = payer.publicKey;

  //             // send the transaction to the cluster
  //             const txSignature = await anchor.web3.sendAndConfirmTransaction(
  //                 connection,
  //                 tx,
  //                 [payer],
  //                 {
  //                     commitment: 'confirmed',
  //                     skipPreflight: true,
  //                 }
  //             );

  //             console.log('\nCollection successfully created!');
  //         } catch (err) {
  //             console.error('\nFailed to create collection:', err);

  //             throw err;
  //         }

  //         // return all the accounts
  //         return {
  //             mint,
  //             tokenAccount,
  //             metadataAccount,
  //             masterEditionAccount,
  //         };
  //     }

  //     const metadataV3 = {
  //         data: {
  //             name: 'string',
  //             symbol: 'string',
  //             uri: 'string',
  //             sellerFeeBasisPoints: 0,
  //             creators: null,
  //             collection: {
  //                 verified: true,
  //                 key: new PublicKey(
  //                     'F17gXajNLmVdMXtCPVpJ8enhwoxtscmDf7fLoJE8vUgw'
  //                 ),
  //             },
  //             uses: null,
  //         },
  //         isMutable: true,
  //         collectionDetails: null,
  //     };

  //     const { mint, tokenAccount, metadataAccount } = await createCollection(
  //         connection,
  //         verifiedUser,
  //         metadataV3
  //     );

  //     const accept = await program.methods
  //         .validateWork()
  //         .accounts({
  //             user: verifiedUser.publicKey,
  //             escrowState: escrowStateKey,
  //             nftMint: mint,
  //             nftTokenAccount: tokenAccount,
  //             metadataAccount: metadataAccount,
  //             systemProgram: anchor.web3.SystemProgram.programId,
  //         })
  //         .signers([verifiedUser])
  //         .rpc();

  //     const result = await program.methods
  //         .exchange()
  //         .accounts({
  //             taker: taker.publicKey,
  //             initializerDepositTokenMint: mintA,
  //             takerDepositTokenMint: mintB,
  //             takerDepositTokenAccount: takerTokenAccountB,
  //             takerReceiveTokenAccount: takerTokenAccountA,
  //             initializerDepositTokenAccount: initializerTokenAccountA,
  //             initializerReceiveTokenAccount: initializerTokenAccountB,
  //             initializer: initializer.publicKey,
  //             escrowState: escrowStateKey,
  //             vault: vaultKey,
  //             vaultAuthority: vaultAuthorityKey,
  //             tokenProgram: TOKEN_PROGRAM_ID,
  //         })
  //         .signers([taker])
  //         .rpc();
  //     console.log(
  //         `https://solana.fm/tx/${result}?cluster=http%253A%252F%252Flocalhost%253A8899%252F`
  //     );

  //     let fetchedInitializerTokenAccountA = await getAccount(
  //         connection,
  //         initializerTokenAccountA
  //     );
  //     let fetchedInitializerTokenAccountB = await getAccount(
  //         connection,
  //         initializerTokenAccountB
  //     );
  //     let fetchedTakerTokenAccountA = await getAccount(
  //         connection,
  //         takerTokenAccountA
  //     );
  //     let fetchedTakerTokenAccountB = await getAccount(
  //         connection,
  //         takerTokenAccountB
  //     );

  //     assert.ok(
  //         Number(fetchedTakerTokenAccountA.amount) == initializerAmount
  //     );
  //     assert.ok(Number(fetchedInitializerTokenAccountA.amount) == 0);
  //     assert.ok(
  //         Number(fetchedInitializerTokenAccountB.amount) == takerAmount
  //     );
  //     assert.ok(Number(fetchedTakerTokenAccountB.amount) == 0);
  // });
});
