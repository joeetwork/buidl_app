'use client';
import React, { useState } from 'react';
import { COLLECTIONS } from '@/constants';
import { useMetadata } from '@/hooks/get-metadata';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';

interface OfferValidatorProps {
  showCollection: boolean;
  collection: PublicKey | null;
  onModalChange: () => void;
  onInputChange: (e: string) => void;
}

export default function OfferValidator({
  showCollection,
  collection,
  onModalChange,
  onInputChange,
}: OfferValidatorProps) {
  const { metadata } = useMetadata(COLLECTIONS);
  const [isHighlighted, setIsHighlighted] = useState(false);

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
    <div
      className={`bg-gray-500 rounded-lg p-4 w-full hover:ring ${
        isHighlighted ? 'ring ring-gray-400 ' : 'hover:ring-gray-700'
      }`}
    >
      <div className="w-full">
        <span className="label-text cursor-default">Add Validator</span>
      </div>
      <div className="flex justify-between w-full">
        {showCollection ? (
          <button className="btn focus:outline-none" onClick={onModalChange}>
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
        ) : (
          <input
            name="initializerAmount"
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={() => setIsHighlighted(true)}
            onBlur={() => setIsHighlighted(false)}
            type="text"
            placeholder="SoliRxTzQ3sbz4it..."
            className="input input-ghost input-md p-0 text-lg bg-gray-500 focus:outline-none w-full"
          />
        )}
      </div>
    </div>
  );
}
