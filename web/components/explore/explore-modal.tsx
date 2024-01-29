import React, { useState } from 'react';
import { AppModal } from '../shared/app-modal';
import Input from '../shared/input';
import TextArea from '../shared/text-area';
import { PublicKey } from '@solana/web3.js';
import { useInitialiseEscrow } from '@/hooks/initialize-escrow';

interface ExploreModalProps {
  hideModal: () => void;
  show: boolean;
  taker: PublicKey;
}

export default function ExploreModal({
  hideModal,
  show,
  taker,
}: ExploreModalProps) {
  const { initializeEscrow } = useInitialiseEscrow();
  const [amount, setAmount] = useState(0);
  const [collection, setCollection] = useState(
    new PublicKey('2buwWpUqd9UaeyxQKiksa14sTyLxJaY27tYVkpR9ja5y')
  );
  const [about, setAbout] = useState('');
  const [count, setCount] = useState(1);

  //   const handleCollectionSelect = (collection: PublicKey) => {
  //     setCollection(collection);
  //   };

  const handleSubmit = () => {
    initializeEscrow.mutateAsync({
      initializerAmount: amount,
      collection,
      about,
      validatorCount: count,
      taker,
    });
  };

  return (
    <AppModal
      title="Job Offer"
      show={show}
      hide={hideModal}
      submit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <div>PublicKey:{taker.toString()}</div>

        <TextArea
          name="about"
          label="About:"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <Input
          name="initializerAmount"
          label="Amount:"
          value={amount.toString()}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <Input
          name="validatorCount"
          label="Validator Count:"
          value={count.toString()}
          onChange={(e) => setCount(Number(e.target.value))}
        />

        {/* <Image src={collection} alt="collection" />; */}
      </div>
    </AppModal>
  );
}
