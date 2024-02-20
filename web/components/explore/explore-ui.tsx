'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React, { useCallback, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import ExploreModal from './explore-modal';
import Link from 'next/link';

export default function ExploreUi() {
  const { userAccounts } = useAccounts();
  const [showModal, setShowModal] = useState(false);
  const [taker, setTaker] = useState<PublicKey>();
  const [title, setTitle] = useState('');

  const handleShowModal = (taker: PublicKey, name: string) => {
    setShowModal(true);
    setTaker(taker);
    setTitle(name);
  };

  const handleHideModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <div>
      <div>
        <h1 className="text-center font-bold text-xl mt-4">Discover the skills you require</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 items-stretch w-10/12 m-auto max-[480px]:grid-cols-1 max-[480px]:gap-y-4 max-[768px]:grid-cols-2">
        {userAccounts.data?.map((user) => {
          return (
            <div
              key={user.publicKey.toString()}
              className="card w-full bg-base-100 shadow-xl"
            >
              <div className="card-body items-center text-center">
                <h2 className="card-title">{user.account.username}</h2>
                <p className="w-full break-words">{user.account.about}</p>
                <div className="card-actions">
                  <button
                    onClick={() =>
                      handleShowModal(
                        user.account.initializerKey,
                        user.account.username
                      )
                    }
                    className="btn btn-primary"
                  >
                    Make offer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ExploreModal
        show={showModal}
        hideModal={handleHideModal}
        taker={taker}
        title={title}
      />
    </div>
  );
}
