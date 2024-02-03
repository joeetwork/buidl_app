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
  const { metadata, isPending } = useMetadata(COLLECTIONS);
  const [amount, setAmount] = useState(0);
  const [about, setAbout] = useState('');
  const [count, setCount] = useState(1);
  const [collection, setCollection] = useState<string | undefined>();

  //   const handleCollectionSelect = (collection: PublicKey) => {
  //     setCollection(collection);
  //   };

  const handleSubmit = () => {
    if (collection && taker) {
      const collectionId = new PublicKey(collection);
      initializeEscrow.mutateAsync({
        initializerAmount: amount,
        collection: collectionId,
        about,
        validatorCount: count,
        taker,
      });
    }
  };

  useEffect(() => {
    if(metadata){
    setCollection(metadata[0]?.id)};
  }, [metadata, isPending]);

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
          value={amount.toString()}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <Input
          name="validatorCount"
          label="Validator Count:"
          value={count.toString()}
          onChange={(e) => setCount(Number(e.target.value))}
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
          onClick={(v) =>
            setCollection(
              metadata.find((item) => item.content.metadata.name === v)?.id
            )
          }
        />
        {/* <Image src={collection} alt="collection" />; */}
      </div>
    </AppModal>
  );
}
