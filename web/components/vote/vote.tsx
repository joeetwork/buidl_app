'use client';

import Image from 'next/image';
import { useMetadata } from '@/hooks/get-metadata';
import { COLLECTIONS } from '@/constants';
import { useCallback, useState } from 'react';
import { PublicKey } from '@solana/web3.js';

import { useValidateCollection } from '@/hooks/validate';
import { useCollection } from '@/hooks/get-collection';
import CollectionModal from './collection-modal';
import VoteModal from './vote-modal';

export default function Vote() {
  const { metadata } = useMetadata(COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState<PublicKey>();
  const [user, setUser] = useState<PublicKey>();
  const { acceptWithCollection, declineWithCollection } =
    useValidateCollection(selectedCollection);
  const { collection, isPending } = useCollection(selectedCollection);
  const [showModal, setShowModal] = useState(false);

  const handleAcceptClick = (escrow: PublicKey) => {
    if (collection.result && collection?.result?.items?.length >= 1) {
      acceptWithCollection.mutateAsync({
        escrow,
        nftAddress: new PublicKey(collection?.result?.items[0]?.id),
      });
    }
  };

  const handleDeclineClick = (escrow: PublicKey) => {
    if (collection.result && collection?.result?.items?.length >= 1) {
      declineWithCollection.mutateAsync({
        escrow,
        nftAddress: new PublicKey(collection?.result?.items[0]?.id),
      });
    }
  };

  function imageLink() {
    const collectionId = collection?.toString();
    const defaultImage = metadata[0]?.content?.links?.image ?? '';

    if (metadata && collectionId) {
      const matchingData = metadata.find((data) => data.id == collectionId);
      return matchingData?.content?.links?.image ?? defaultImage;
    }

    return defaultImage;
  }

  const handleModalClick = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

  const handleClick = (e: PublicKey, user = false) => {
    if (user) {
      setUser(e);
    }

    if (!user) {
      setSelectedCollection(e);
    }
  };

  return (
    <div className="h-full">
      <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
        <div className="flex justify-between w-full">
          <button className="btn focus:outline-none" onClick={handleModalClick}>
            {metadata ? (
              <Image
                unoptimized={true}
                loader={() => imageLink()}
                src={imageLink()}
                alt="Collection Image"
                height={25}
                width={25}
                className="rounded-full"
              />
            ) : null}
            {collection?.toString() ?? metadata
              ? metadata[0].content.metadata.name
              : ''}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>

        <div className="card-actions flex">
          <button
            onClick={() =>
              selectedCollection && handleAcceptClick(selectedCollection)
            }
            className="btn btn-primary"
            disabled={!selectedCollection}
          >
            Accept Work
          </button>

          <button
            onClick={() =>
              selectedCollection && handleDeclineClick(selectedCollection)
            }
            className="btn btn-primary"
            disabled={!selectedCollection}
          >
            Decline Work
          </button>
        </div>
      </div>

      <VoteModal
        show={showModal}
        hideModal={handleModalClick}
        onClick={handleClick}
      />

      {/* <CollectionModal
        show={showCollectionModal}
        hideModal={handleCollectionModalClick}
        selectedCollection={selectedCollection}
      /> */}
    </div>
  );
}
