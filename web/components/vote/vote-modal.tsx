import React, { useState } from 'react';
import { AppModal } from '../shared/app-modal';
import { PublicKey } from '@solana/web3.js';
import { useMetadata } from '@/hooks/get-metadata';
import { COLLECTIONS } from '@/constants';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAccounts } from '@/hooks/get-accounts';

interface VoteModalProps {
  hideModal: () => void;
  onClick: (collection: PublicKey, user?: boolean) => void;
  show: boolean;
  taker?: PublicKey;
}

export default function VoteModal({
  hideModal,
  onClick,
  show,
}: VoteModalProps) {
  const { metadata } = useMetadata(COLLECTIONS);
  const { publicKey } = useWallet();
  const { userAccount } = useAccounts();
  const [collection, setCollection] = useState<string>();

  const handleClick = (v: string | PublicKey | null) => {
    if (typeof v === 'string') {
      setCollection(
        metadata.find((item) => item.content.metadata.name === v)?.id
      );
    }

    if (collection) {
      onClick(new PublicKey(collection));
      hideModal();
    }

    if (v instanceof PublicKey) {
      onClick(v, true);
      hideModal();
    }
  };

  return (
    <AppModal title={`Select Collection`} show={show} hide={hideModal}>
      <div className="grid grid-cols-1">
        <div
          className="cursor-pointer hover:bg-gray-400"
          onClick={() => handleClick(publicKey)}
        >
          <div className="flex gap-6 items-center px-6 py-2">
            <Image
              unoptimized={true}
              loader={() => userAccount.data?.pfp ?? ''}
              src={userAccount.data?.pfp ?? ''}
              alt="User"
              className="rounded-full"
              width={40}
              height={40}
            />

            {userAccount.data?.username ?? 'Guest'}
          </div>
        </div>
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
                  alt="Collection"
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
