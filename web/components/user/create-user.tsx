'use client';

import React, { useState } from 'react';
import UserModal from './user-modal';

export default function CreateUser() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className="btn">
        Create User
      </button>
      <UserModal show={showModal} hideModal={() => setShowModal(false)} />
    </>
  );
}
