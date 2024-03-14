'use client';
import React, { useCallback, useState } from 'react';
import { COLLECTIONS } from '@/constants';
import { useMetadata } from '@/hooks/get-metadata';
import Image from 'next/image';
import VoteModal from './vote-modal';
import { PublicKey } from '@solana/web3.js';

interface VoteSelectProps {
  collection: PublicKey | null;
  onChange: (e: PublicKey) => void;
}

export default function VoteSelect({ collection, onChange }: VoteSelectProps) {
  const { metadata } = useMetadata(COLLECTIONS);
  const [showModal, setShowModal] = useState(false);

  const handleModalClick = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

  function imageLink() {
    const collectionId = collection?.toString();
    const defaultImage = metadata[0]?.content?.links?.image ?? '';

    if (metadata && collectionId) {
      const matchingData = metadata.find((data) => data.id == collectionId);
      return matchingData?.content?.links?.image ?? defaultImage;
    }

    return defaultImage;
  }

  return (
    <>
      <div
        className={`bg-gray-500 rounded-lg p-4 w-full hover:ring hover:ring-gray-700`}
      >
        <div className="w-full">
          <span className="label-text cursor-default">Select Collection</span>
        </div>
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
      </div>

      <VoteModal
        show={showModal}
        hideModal={handleModalClick}
        onClick={(e) => onChange(e)}
      />
    </>
  );
}
