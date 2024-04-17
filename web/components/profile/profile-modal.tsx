'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { useInitialiseUser } from '@/hooks/initialize-user';
import { useAccounts } from '@/hooks/get-accounts';
import { AppModal } from '../shared/app-modal';
import Avatar from '../shared/avatar';
import Input from '../shared/input';
import TextArea from '../shared/text-area';
import { ProfileModalProps, UserLinkProps } from '@/types/profile';
import { UserLinks } from '../shared/user-links';

export default function ProfileModal({ show, hideModal }: ProfileModalProps) {
  const { initializeUser } = useInitialiseUser();
  const { userAccount } = useAccounts();
  const [name, setName] = useState<string>(userAccount.data?.username ?? '');
  const [about, setAbout] = useState<string>(userAccount.data?.about ?? '');
  const [pfp, setPfp] = useState<string>(userAccount.data?.pfp ?? '');

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

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log('File uploaded:', file);
    }
  };

  const handleSubmit = () => {
    initializeUser.mutateAsync({
      name: name,
      about: about,
      role: userAccount.data?.role ?? 'Client',
      pfp: pfp,
      links: links,
    });
  };

  useEffect(() => {
    setName(userAccount.data?.username ?? '');
    setAbout(userAccount.data?.about ?? '');
    setPfp(userAccount.data?.pfp ?? '');
    setLinks(userAccount.data?.links ?? '');
  }, [
    userAccount.data?.username,
    userAccount.data?.about,
    userAccount.data?.pfp,
    userAccount.data?.links,
  ]);

  const renderUsername =
    userAccount.data?.username === userAccount.data?.initializer?.toString()
      ? undefined
      : userAccount.data?.username;

  return (
    <AppModal
      title={`Edit Profile`}
      show={show}
      hide={hideModal}
      width="w-[50%]"
    >
      <div className="pt-4 px-8">
        <div className="flex flex-col gap-4 pb-4 items-center">
          <div className="mr-auto">
            <Avatar onFileUpload={handleFileUpload} src={pfp ?? ''} />
          </div>
          <div className="w-full">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={renderUsername}
            />
          </div>
          <div className="w-full">
            <TextArea
              label="Bio"
              onChange={(e) => setAbout(e.target.value)}
              placeholder={'Tell us about yourself/your company'}
            />
          </div>

          <UserLinks
            userAccountLinks={links}
            onInputChange={handleInputChange}
          />
        </div>
        <div className="w-full text-end mt-4">
          <button onClick={handleSubmit} className="btn">
            Save Changes
          </button>
        </div>
      </div>
    </AppModal>
  );
}
