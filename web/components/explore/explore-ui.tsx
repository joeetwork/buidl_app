'use client';

import { usePagination } from '@/hooks/pagination';
import React, { useEffect, useState } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loadie from '../shared/loadie';
import Link from 'next/link';
import Avatar from '../shared/avatar';

type UserMap =
  | Map<string, anchor.IdlAccounts<AnchorEscrow>['user']>
  | undefined;
type UserAccounts = anchor.IdlAccounts<AnchorEscrow>['user'][];

export default function ExploreUi() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<UserMap>();
  const { userAccounts, maxAccounts } = usePagination({
    page: page,
    perPage: 8,
  });

  const handleClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (userAccounts.data) {
      setUsers((prevUsers) => {
        const updatedUsersMap = prevUsers ? new Map(prevUsers) : new Map();

        (userAccounts.data as UserAccounts).forEach((user) => {
          if (user.role === 'Freelancer' && user.about) {
            updatedUsersMap.set(user.initializer.toString(), user);
          }
        });

        return updatedUsersMap;
      });
    }
  }, [userAccounts.data]);

  return (
    <div>
      <div>
        <h1 className="text-center font-bold text-xl mt-4">
          Discover the skills you require
        </h1>
      </div>

      <InfiniteScroll
        dataLength={maxAccounts}
        next={handleClick}
        hasMore={maxAccounts !== users?.size}
        loader={
          <div className="w-full text-center py-4">
            <Loadie />
          </div>
        }
      >
        <div className="grid grid-cols-3 gap-4 items-stretch w-10/12 m-auto max-[480px]:grid-cols-1 max-[480px]:gap-y-4 max-[768px]:grid-cols-2">
          {users && users?.size > 0
            ? [...users.values()].map((user) => {
                return (
                  <div
                    key={user?.initializer.toString()}
                    className="card w-full bg-base-100 shadow-xl"
                  >
                    <div className="card-body items-center text-center">
                      <Avatar src={user.pfp ?? ''} />
                      <h2 className="card-title">
                        {user?.username === user.initializer.toString()
                          ? 'Guest'
                          : user.username}
                      </h2>
                      <p className="w-full break-words">{user?.about}</p>
                      <div className="card-actions">
                        <Link
                          href={`offer/${
                            user.username === user.initializer.toString()
                              ? 'guest'
                              : user.username
                          }/${user.initializer}`}
                        >
                          <button className="btn btn-primary">
                            Make offer
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </InfiniteScroll>
    </div>
  );
}
