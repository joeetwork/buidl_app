import React, { useEffect, useState } from 'react';
import { AppModal } from '../shared/app-modal';
import Input from '../shared/input';
import TextArea from '../shared/text-area';
import { PublicKey } from '@solana/web3.js';
import { useInitialiseEscrow } from '@/hooks/initialize-escrow';
import { ellipsify } from '../shared/ellipsify';
import { useMetadata } from '@/hooks/get-metadata';
import { COLLECTIONS } from '@/constants';
import Select from '../shared/select';

interface ExploreModalProps {
  hideModal: () => void;
  show: boolean;
  taker?: PublicKey;
  title: string;
}

export default function ExploreModal({
  hideModal,
  show,
  taker,
  title,
}: ExploreModalProps) {
  const { initializeEscrow } = useInitialiseEscrow();
  const { metadata } = useMetadata(COLLECTIONS);
  const [amount, setAmount] = useState(0);
  const [about, setAbout] = useState('');
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [validator, setValidator] = useState<PublicKey | null>(null);

  const handleSelect = (v: string) => {
    const collection = metadata.find(
      (item) => item.content.metadata.name === v
    )?.id;

    if (collection) {
      setCollection(new PublicKey(collection));
    }
  };

  const handleSubmit = () => {
    if (taker) {
      initializeEscrow.mutateAsync({
        initializerAmount: amount,
        collection,
        about,
        validator,
        taker,
      });
    }
  };

  useEffect(() => {
    hideModal();
  }, [initializeEscrow.isSuccess, hideModal]);

  return (
    <AppModal
      title={`Hire: ${title}`}
      show={show}
      hide={hideModal}
      submit={handleSubmit}
    >
      <div className="flex flex-col gap-4 items-center">
        <div>PublicKey: {ellipsify(taker?.toString())}</div>

        <Input
          name="initializerAmount"
          label="Amount:"
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <Input
          name="validator"
          label="Validator Pubkey:"
          onChange={(e) => setValidator(new PublicKey(e.target.value))}
        />

        <TextArea
          name="about"
          label="About:"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <Select
          label="Collection"
          items={metadata?.map((item) => item.content.metadata.name) ?? []}
          onClick={handleSelect}
        />
      </div>
    </AppModal>
  );
}
