'use client';

import React, { useCallback, useState } from 'react';
import ValidatorModal from './validator-modal';


export default function ValidatorUi() {
  const [showModal, setShowModal] = useState(false);

  const handleHideModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <>
      <div className="flex flex-col">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Show gigs to validate
        </button>
      </div>

      <ValidatorModal show={showModal} hideModal={handleHideModal} />
    </>
  );
}
