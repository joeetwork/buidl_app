'use client';

import React, { useState } from 'react';
import VoteInfo from './vote-info';
import VoteActions from './vote-actions';
import VoteContracts from './vote-contracts';
import VoteSelect from './vote-select';
import { PublicKey } from '@solana/web3.js';

export default function CollectionVote() {
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [contract, setContract] = useState<PublicKey | null>(null);

  return (
    <>
      <VoteSelect onChange={setCollection} collection={collection} />

      <VoteContracts onClick={setContract} collection={collection} />

      <VoteInfo contract={contract} />

      <VoteActions collection={collection} contract={contract} />
    </>
  );
}
