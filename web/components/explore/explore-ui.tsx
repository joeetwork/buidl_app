'use client';

import { useAccounts } from '@/hooks/get-accounts';
import React, { useCallback, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import ExploreModal from './explore-modal';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

type UserAccounts = anchor.IdlAccounts<AnchorEscrow>['user'][];

export default function ExploreUi() {
  const { userAccounts } = useAccounts();
  const [showModal, setShowModal] = useState(false);
  const [taker, setTaker] = useState<PublicKey>();
  const [title, setTitle] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<UserAccounts>([]);

  const handleShowModal = (taker: PublicKey, name: string) => {
    setShowModal(true);
    setTaker(taker);
    setTitle(name);
  };

  const handleHideModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const handleClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const fetchAcounts = async () => {
      try {
        const result = await userAccounts.mutateAsync({ page, perPage: 2 });
        if (result) {
          setUsers((prevUsers) => [...prevUsers, ...(result as UserAccounts)]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchAcounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <div>
        <h1 className="text-center font-bold text-xl mt-4">
          Discover the skills you require
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 items-stretch w-10/12 m-auto max-[480px]:grid-cols-1 max-[480px]:gap-y-4 max-[768px]:grid-cols-2">
        {users.length > 0
          ? users.map((user) => {
              return (
                <div
                  key={user?.initializerKey.toString()}
                  className="card w-full bg-base-100 shadow-xl"
                >
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">{user?.username}</h2>
                    <p className="w-full break-words">{user?.about}</p>
                    <div className="card-actions">
                      <button
                        onClick={() =>
                          user
                            ? handleShowModal(
                                user.initializerKey,
                                user.username
                              )
                            : null
                        }
                        className="btn btn-primary"
                      >
                        Make offer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          : null}

        <button onClick={handleClick}>test</button>
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
