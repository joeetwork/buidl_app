'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import ExploreModal from './explore-modal';

export default function ExploreUi() {
  const { userAccounts } = useAccounts();
  const [showModal, setShowModal] = useState(false);
  const [taker, setTaker] = useState(
    new PublicKey('2buwWpUqd9UaeyxQKiksa14sTyLxJaY27tYVkpR9ja5y')
  );

  const handleShowModal = (taker: PublicKey) => {
    setShowModal(true);
    setTaker(taker);
  };

  return (
    <div>
      {userAccounts.data?.map((user) => {
        return (
          <div
            key={user.publicKey.toString()}
            className="flex flex-col"
            onClick={() => handleShowModal(user.account.initializerKey)}
          >
            <div>{user.account.username}</div>
            <div>{user.account.about}</div>
          </div>
        );
      })}

      {taker ? (
        <ExploreModal
          show={showModal}
          hideModal={() => setShowModal(false)}
          taker={taker}
        />
      ) : null}
    </div>
  );
}
