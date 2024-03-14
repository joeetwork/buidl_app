'use client';
import React, { useState } from 'react';
import { useInitialiseEscrow } from '@/hooks/initialize-escrow';
import CollectionVote from './collection-vote';
import UserVote from './user-vote';

export default function Vote() {
  const { initializeEscrow } = useInitialiseEscrow();
  const [showCollection, setShowCollection] = useState(true);

  return (
    <div className="h-full">
      {!initializeEscrow.isSuccess ? (
        <div className="mx-auto pt-16 pb-6 flex flex-col gap-2 items-center lg:w-2/6 md:w-1/2">
          <div className="flex justify-between w-full">
            <h3 className="font-bold text-lg">Validate work</h3>

            <div className="flex">
              <span className="pr-2">
                {showCollection ? 'Collection' : 'User'}
              </span>
              <input
                type="checkbox"
                className="toggle"
                checked={showCollection}
                onChange={() => setShowCollection(!showCollection)}
              />
            </div>
          </div>

          {showCollection ? <CollectionVote /> : <UserVote />}
        </div>
      ) : (
        <div>Congrats request sent</div>
      )}
    </div>
  );
}
