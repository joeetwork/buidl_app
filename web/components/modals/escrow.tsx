import React from 'react';
import Input from '../input';
import Image from 'next/image';
import TextArea from '../text-area';

interface EscrowProps {
  collection: string[];
  onChangeAbout: () => void;
  onChangeAmount: () => void;
}

export default function Escrow({
  collection,
  onChangeAbout,
  onChangeAmount,
}: EscrowProps) {
  return (
    <div className="flex flex-col gap-4">
      <TextArea label="About:" onChange={onChangeAbout} />

      <Input label="Amount:" onChange={onChangeAmount} />

      {collection.map((nft, i) => {
        return <Image key={i} src={nft} alt="collection" />;
      })}
    </div>
  );
}
