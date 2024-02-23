'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useInitialiseEscrow } from '@/hooks/initialize-escrow';
import { COLLECTIONS } from '@/constants';
import { useMetadata } from '@/hooks/get-metadata';
import { PublicKey } from '@solana/web3.js';
import Input from '../shared/input';
import TextArea from '../shared/text-area';

export default function Offer() {
  const { name, pubkey } = useParams();
  const { initializeEscrow } = useInitialiseEscrow();
  const { metadata } = useMetadata(COLLECTIONS);
  const [amount, setAmount] = useState(0);
  const [about, setAbout] = useState('');
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [validator, setValidator] = useState<PublicKey | null>(null);

  // const handleSelect = (v: string) => {
  //   const collection = metadata.find(
  //     (item) => item.content.metadata.name === v
  //   )?.id;

  //   if (collection) {
  //     setCollection(new PublicKey(collection));
  //   }
  // };

  const handleSubmit = () => {
    initializeEscrow.mutateAsync({
      initializerAmount: amount,
      collection,
      about,
      validator,
      taker: new PublicKey(pubkey),
    });
  };

  useEffect(() => {
    setAmount(0);
    setAbout('');
    setCollection(null);
    setValidator(null);
  }, [initializeEscrow.isSuccess]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col gap-4 items-center w-2/6">
        <h3 className="font-bold text-lg">{decodeURIComponent(name)}</h3>
        <div className="w-full px-4">
          <span className="label-text">You pay</span>
        </div>
        <div className="flex justify-between w-full px-6">
          <Input
            name="initializerAmount"
            value={amount.toString()}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <button className="flex items-center gap-4 btn m-auto">
            <h1>
              {collection?.toString() ?? metadata
                ? metadata[0].content.metadata.name
                : ''}
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-between w-full px-4">
          <TextArea
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary mt-2 w-full mx-4"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
}
