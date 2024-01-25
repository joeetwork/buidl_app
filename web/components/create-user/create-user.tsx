'use client';

import React, { useState } from 'react';
import User from '../modals/user';
import { useInitialiseUser } from '@/instructions/initialize-user';
import Modal from '../modal';

interface UserProps {
  name: string;
  about: string;
  role: string;
}

export default function CreateUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserProps>({
    name: '',
    role: '',
    about: '',
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClick = (value: string) => {
    setUserDetails((prevState) => ({
      ...prevState,
      role: value,
    }));
  };

  //create the escrow
  const { initializeUser } = useInitialiseUser();

  const handleSubmit = () => {
    initializeUser.mutateAsync(userDetails);
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="btn">
        Create User
      </button>
      <Modal
        title="Create User"
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        onSubmit={handleSubmit}
      >
        <User
          user={userDetails}
          onChange={handleChange}
          onClick={handleClick}
        />
      </Modal>
    </>
  );
}
