'use client';

import { useAccounts } from '@/instructions/get-accounts';
import React, { useEffect, useState } from 'react';
import Modal from '../modal';
import Escrow from '../modals/escrow';
import { useInitialiseEscrow } from '@/instructions/initialize-escrow';
import { PublicKey } from '@solana/web3.js';

interface EscrowProps {
  initializerAmount: number;
  taker: PublicKey;
  collection: PublicKey;
  about: string;
  validatorCount: number;
}

export default function ExploreUi() {
  // get created user accounts
  const { userAccounts } = useAccounts();

  // add modal for creating escrow
  const [isOpen, setIsOpen] = useState(false);
  const [escrowDetails, setEscrowDetails] = useState<EscrowProps>({
    initializerAmount: 0,
    taker: new PublicKey('9ifBnWRecQxF3b4UfqEWp2pw7a6UAVBYiDfYYB7UtFq2'),
    collection: new PublicKey('9ifBnWRecQxF3b4UfqEWp2pw7a6UAVBYiDfYYB7UtFq2'),
    about: '',
    validatorCount: 1,
  });

  const handleModalClick = (taker: PublicKey) => {
    setIsOpen(!isOpen);
    setEscrowDetails((prevState) => ({
      ...prevState,
      taker,
    }));
  };

  //   const handleCollectionSelect = (collection: PublicKey) => {
  //     setEscrowDetails((prevState) => ({
  //       ...prevState,
  //       collection,
  //     }));
  //   };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setEscrowDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //create the escrow
  const { initializeEscrow } = useInitialiseEscrow();

  const handleSubmit = () => {
    initializeEscrow.mutateAsync(escrowDetails);

    if (initializeEscrow.isSuccess) {
      setIsOpen(!isOpen);
    }
  };

  //add helius api to display the collection and metadata related

  return (
    <div>
      {userAccounts.data?.map((user) => {
        return (
          <div
            key={user.publicKey.toString()}
            className="flex flex-col"
            onClick={() => handleModalClick(user.publicKey)}
          >
            <div>{user.account.username}</div>
            <div>{user.account.about}</div>
          </div>
        );
      })}

      <Modal
        title="Job Offer"
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        onSubmit={handleSubmit}
      >
        <Escrow
          collections={[escrowDetails.collection]}
          escrow={escrowDetails}
          onChange={handleChange}
        />
      </Modal>
    </div>
  );
}
