'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { AppModal } from '../shared/app-modal';
import { UserLinkProps } from '@/types/profile';
import { UserLinks } from '../shared/user-links';
import { useInitialiseUser } from '@/hooks/initialize-user';
import { useAccounts } from '@/hooks/get-accounts';

interface OfferModalProps {
  show: boolean;
  hideModal: () => void;
}

export default function OfferModal({ show, hideModal }: OfferModalProps) {
  const { initializeUser } = useInitialiseUser();
  const { userAccount } = useAccounts();

  const [links, setLinks] = useState<UserLinkProps>(
    userAccount.data?.links ?? {
      discord: null,
      telegram: null,
      twitter: null,
      github: null,
    }
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setLinks((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    initializeUser.mutateAsync({
      name: userAccount.data?.username ?? '',
      about: userAccount.data?.about ?? '',
      role: userAccount.data?.role ?? 'Client',
      pfp: userAccount.data?.pfp ?? '',
      links: links,
    });
  };

  return (
    <AppModal title={`Add Contacts`} show={show} hide={hideModal}>
      <div className="pt-4 px-8">
        <p className="pb-4 text-lg font-bold text-center text-red-800">
          A contact is required to send offers
        </p>

        <UserLinks userAccountLinks={links} onInputChange={handleInputChange} />

        <div className="w-full text-end mt-4">
          <button onClick={handleSubmit} className="btn">
            Save Changes
          </button>
        </div>
      </div>
    </AppModal>
  );
}
