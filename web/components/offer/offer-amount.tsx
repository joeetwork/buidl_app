'use client';

import React, { useState } from 'react';

import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';

interface OfferAmountProps {
  token?: PublicKey | null;
  onChange: (e: number) => void;
  onModalChange?: () => void;
}

export default function OfferAmount({
  token,
  onChange,
  onModalChange,
}: OfferAmountProps) {
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

  const src =
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png';

  return (
    <div
      className={`bg-teal-700 rounded-lg p-4 hover:ring ${
        isHighlighted ? 'ring ring-teal-400 ' : 'hover:ring-teal-600'
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
            className="input input-ghost input-lg p-0 text-4xl bg-teal-700 focus:outline-none w-full"
          />
          {inputValue && <p>{`$${Number(inputValue).toFixed(2)}`}</p>}
        </div>

        <button
          className="flex items-center gap-4 btn m-auto focus:outline-none tooltip before:max-w-none"
          data-tip={'More Tokens coming soon'}
        >
          <Image
            unoptimized={true}
            loader={() => src}
            src={src}
            alt="USDC Logo"
            height={25}
            width={25}
          />
          USDC
        </button>
      </div>
    </div>
  );
}
