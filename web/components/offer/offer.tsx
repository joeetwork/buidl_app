'use client';
import { useParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { useInitialiseEscrow } from '@/hooks/initialize-escrow';
import { PublicKey } from '@solana/web3.js';
import { ellipsify } from '../shared/ellipsify';
import OfferModal from './offer-modal';
import OfferAmount from './offer-amount';
import OfferValidator from './offer-validator';
import OfferAboutInput from './offer-about';

export default function Offer() {
  const { name, pubkey } = useParams();
  const { initializeEscrow } = useInitialiseEscrow();
  const [amount, setAmount] = useState<number>();
  const [about, setAbout] = useState('');
  const [collection, setCollection] = useState<PublicKey | null>(null);
  const [validator, setValidator] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCollection, setShowCollection] = useState(true);

  const handleModalClick = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

  const handleSubmit = () => {
    if (amount) {
      initializeEscrow.mutateAsync({
        initializerAmount: amount * 1000000,
        collection,
        about,
        validator: validator ? new PublicKey(validator) : null,
        taker: new PublicKey(pubkey),
      });
    }
  };

  const handleInputChange = useCallback((v: string) => {
    setValidator(v);
  }, []);

  return (
    <div className="h-full">
      {!initializeEscrow.isSuccess ? (
        <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
          <div className="flex justify-between w-full">
            <h3 className="font-bold text-lg">
              Name: {`${decodeURIComponent(name)}`}{' '}
              <span className="tooltip before:max-w-none" data-tip={pubkey}>
                {' '}
                ({ellipsify(pubkey)})
              </span>
            </h3>

            <div className="flex">
              <span className="pr-2">
                {showCollection ? 'Collection' : 'Validator'}
              </span>
              <input
                type="checkbox"
                className="toggle"
                checked={showCollection}
                onChange={() => setShowCollection(!showCollection)}
              />
            </div>
          </div>

          <OfferAmount onChange={(e) => setAmount(e)} />

          <OfferValidator
            onModalChange={handleModalClick}
            collection={collection}
            showCollection={showCollection}
            onInputChange={handleInputChange}
          />

          <OfferAboutInput onChange={(e) => setAbout(e)} />

          <button
            className="btn btn-primary mt-2 w-full mx-4"
            onClick={handleSubmit}
            disabled={
              showCollection
                ? !amount || !about || !collection
                : !amount || !about || !validator
            }
          >
            Send
          </button>
        </div>
      ) : (
        <div>Congrats request sent</div>
      )}

      <OfferModal
        show={showModal}
        hideModal={handleModalClick}
        onClick={(e) => setCollection(e)}
      />
    </div>
  );
}
