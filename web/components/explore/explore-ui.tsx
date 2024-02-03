'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React, { useCallback, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import ExploreModal from './explore-modal';
import Pagination from '../shared/pagination';

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
    <div className="flex flex-col justify-evenly m-auto">
      <div className="flex">
        {userAccounts.data?.map((user) => {
          return (
            <div key={user.publicKey.toString()}>
              <div className="card w-72 bg-base-100 shadow-xl">
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
            </div>
          );
        })}
      </div>

      <div className="pt-8">
        <Pagination />
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
