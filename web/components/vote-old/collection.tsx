'use client';

import React, { useCallback, useState } from 'react';
import { ellipsify } from '../shared/ellipsify';
import Loadie from '../shared/loadie';
import { PublicKey } from '@solana/web3.js';
import { useMetadata } from '@/hooks/get-metadata';
import { COLLECTIONS } from '@/constants';
import CollectionModal from './collection-modal';

export default function Collection() {
  const [selectedCollection, setSelectedCollection] = useState<PublicKey>();
  const { metadata, isPending } = useMetadata(COLLECTIONS);
  const [showModal, setShowModal] = useState(false);

  const handleCollectionClick = (collection: PublicKey) => {
    setSelectedCollection(collection);
    setShowModal(true);
  };

  const handleHideModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <>
      <div>
        <p className="text-center pt-2">Verified Collections</p>
        {isPending ? <Loadie /> : null}
        <div className="grid grid-cols-3 gap-4 items-stretch">
          {metadata?.map((data, i) => {
            return (
              <div key={i} className="card w-60 bg-base-100 shadow-xl m-auto">
                <figure className="px-10">
                  <img
                    src={data.content.links.image}
                    alt="Shoes"
                    className="rounded-xl"
                  />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">{data.content.metadata.name}</h2>
                  <p>Pubkey: {ellipsify(data.id)}</p>
                  <div className="card-actions">
                    <button
                      onClick={() =>
                        handleCollectionClick(new PublicKey(data.id))
                      }
                      className="btn btn-primary"
                    >
                      Select Collection
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CollectionModal
        show={showModal}
        selectedCollection={selectedCollection}
        hideModal={handleHideModal}
      />
    </>
  );
}
