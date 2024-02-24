'use client';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useInitialiseEscrow } from '@/hooks/initialize-escrow';
import { COLLECTIONS } from '@/constants';
import { useMetadata } from '@/hooks/get-metadata';
import { PublicKey } from '@solana/web3.js';
import { ellipsify } from '../shared/ellipsify';
import OfferModal from './offer-modal';

interface InputFieldProps {
  token?: PublicKey | null;
  onChange: (e: number) => void;
  onModalChange?: () => void;
}

function InputField({ token, onChange, onModalChange }: InputFieldProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, '');

    const decimalCount = (newValue.match(/\./g) || []).length;

    if (decimalCount <= 1) {
      setInputValue(newValue);

      onChange(Number(newValue));
    }
  };

  return (
    <div
      className={`bg-gray-500 rounded-lg p-4 hover:ring ${
        isHighlighted ? 'ring ring-gray-400 ' : 'hover:ring-gray-700'
      }`}
    >
      <div className="w-full">
        <span className="label-text cursor-default">You pay</span>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <input
            name="initializerAmount"
            value={inputValue}
            onChange={(e) => handleChange(e)}
            onFocus={() => setIsHighlighted(true)}
            onBlur={() => setIsHighlighted(false)}
            type="text"
            placeholder="0"
            className="input input-ghost input-lg p-0 text-4xl bg-gray-500 focus:outline-none w-full"
          />
          {inputValue && <p>{`$${Number(inputValue).toFixed(2)}`}</p>}
        </div>

        <button
          className="flex items-center gap-4 btn m-auto focus:outline-none tooltip before:max-w-none"
          data-tip={'More Tokens coming soon'}
        >
          <div className="w-6">
            <img
              src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
              alt="USDC Logo"
            />
          </div>
          USDC
        </button>
      </div>
    </div>
  );
}

interface ValidatorFieldProps {
  showCollection: boolean;
  collection: PublicKey | null;
  onModalChange: () => void;
  onInputChange: (e: string) => void;
}

function ValidatorField({
  showCollection,
  collection,
  onModalChange,
  onInputChange,
}: ValidatorFieldProps) {
  const { metadata } = useMetadata(COLLECTIONS);
  const [isHighlighted, setIsHighlighted] = useState(false);

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

interface TextFieldProps {
  onChange: (e: string) => void;
}

function TextAreaInput({ onChange }: TextFieldProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={`bg-gray-500 rounded-lg p-4 w-full hover:ring ${
        isHighlighted ? 'ring ring-gray-400' : 'hover:ring-gray-700'
      }`}
    >
      <div className="w-full">
        <span className="label-text cursor-default">Your offer</span>
      </div>
      <textarea
        className="textarea textarea-lg w-full p-0 resize-none bg-gray-500 focus:outline-none"
        name="about"
        onFocus={() => setIsHighlighted(true)}
        onBlur={() => setIsHighlighted(false)}
        placeholder="Gm, I've got an exciting opportunity for you..."
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
}

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
        initializerAmount: amount,
        collection,
        about,
        validator: new PublicKey(validator),
        taker: new PublicKey(pubkey),
      });
    }
  };

  const handleInputChange = useCallback((v: string) => {
    setValidator(v);
  }, []);

  useEffect(() => {
    setAmount(0);
    setAbout('');
    setCollection(null);
    setValidator('');
  }, [initializeEscrow.isSuccess]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col gap-2 items-center w-2/6">
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

        <InputField onChange={(e) => setAmount(e)} />

        <ValidatorField
          onModalChange={handleModalClick}
          collection={collection}
          showCollection={showCollection}
          onInputChange={handleInputChange}
        />

        <TextAreaInput onChange={(e) => setAbout(e)} />

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

      <OfferModal
        show={showModal}
        hideModal={handleModalClick}
        onClick={(e) => setCollection(e)}
      />
    </div>
  );
}
