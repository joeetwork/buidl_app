import React from 'react';
import { AppModal } from './app-modal';
import { PublicKey } from '@solana/web3.js';
import { useMetadata } from '@/hooks/get-metadata';
import { COLLECTIONS } from '@/constants';
import Image from 'next/image';

interface CollectionModalProps {
  hideModal: () => void;
  onClick: (collection: PublicKey) => void;
  show: boolean;
  taker?: PublicKey;
}

export default function CollectionModal({
  hideModal,
  onClick,
  show,
}: CollectionModalProps) {
  const { metadata } = useMetadata(COLLECTIONS);

  const handleClick = (v: string) => {
    const collection = metadata.find(
      (item) => item.content.metadata.name === v
    )?.id;

    if (collection) {
      onClick(new PublicKey(collection));
      hideModal();
    }
  };

  return (
    <AppModal title={`Select Collection`} show={show} hide={hideModal}>
      <div className="grid grid-cols-1">
        <h3 className="px-6 pb-2">Verified Collections</h3>
        {metadata?.map((data, i) => {
          return (
            <div
              key={i}
              className="cursor-pointer hover:bg-gray-400"
              onClick={() => handleClick(data.content.metadata.name)}
            >
              <div className="flex gap-6 items-center px-6 py-2">
                <Image
                  unoptimized={true}
                  loader={() => data.content.links.image ?? ''}
                  src={data.content.links.image ?? ''}
                  alt="Shoes"
                  className="rounded-full"
                  width={40}
                  height={40}
                />

                {data.content.metadata.name}
              </div>
            </div>
          );
        })}
      </div>
    </AppModal>
  );
}
