'use client';

import { useAccounts } from '@/hooks/get-accounts';
import { useValidate } from '@/hooks/validate';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';
import Exchange from '../exchange/exchange';
import UploadWork from '../upload-work/upload-work';
import { COLLECTIONS, ROLES } from '@/constants';
import { useCollection } from '@/hooks/get-collection';
import Tabs from '../shared/tabs';
import Validator from './validator';

export default function CurrentJobs() {
  const { validate } = useValidate();
  const [selectedCollection, setSelectedCollection] = useState<PublicKey>();
  const [selectedEscrow, setSelectedEscrow] = useState<PublicKey>();
  // const { publicKey } = useWallet();
  const { validatorEscrows } = useAccounts();
  const { collection } = useCollection(selectedCollection);

  const handleCollectionClick = (collection: PublicKey) => {
    setSelectedCollection(collection);
    validatorEscrows.mutateAsync(collection);
  };

  const handleEscrowClick = (escrow: PublicKey) => {
    setSelectedEscrow(escrow);
  };

  const [activeTab, setActiveTab] = useState(0);

  const Roles = [<></>, <></>, <Validator />];

  return (
    <div className="flex flex-col items-center">
      <Tabs tabs={ROLES} setTab={setActiveTab} activeTab={activeTab} />

      <div>{Roles[activeTab]}</div>
    </div>
  );
}
