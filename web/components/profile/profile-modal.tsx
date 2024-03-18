'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { useInitialiseUser } from '@/hooks/initialize-user';
import { useAccounts } from '@/hooks/get-accounts';
import { AppModal } from '../shared/app-modal';
import Avatar from '../shared/avatar';
import Input from '../shared/input';
import TextArea from '../shared/text-area';
import Image from 'next/image';
import {
  FilteredProps,
  LinksProps,
  ProfileModalProps,
  RolesProps,
  UserLinkProps,
} from '@/types/profile';

function Links({ userAccountLinks, onInputChange }: LinksProps) {
  const [selectedContacts, setSelectedContacts] = useState<FilteredProps[]>([]);
  const [linkValue, setLinkValues] = useState<UserLinkProps>();

  const handleCommunicationMethodChange = (img: FilteredProps) => {
    setSelectedContacts((prevContacts) => {
      if (prevContacts.includes(img)) {
        return prevContacts.filter((contact) => contact !== img);
      } else {
        return [...prevContacts, img];
      }
    });
  };

  useEffect(() => {
    const userLinks = userAccountLinks
      ? Object.entries(userAccountLinks).filter(
          ([key, value]) => value !== 'github' && value !== null
        )
      : [];

    userLinks.forEach(([key, value]) => {
      handleCommunicationMethodChange(key as FilteredProps);
    });

    setLinkValues(userAccountLinks);
  }, [userAccountLinks]);

  return (
    <div className="w-full px-6">
      <div className="text-center">Select a minimum of one social</div>
      <div className="flex w-full justify-evenly py-4">
        {['twitter', 'discord', 'telegram'].map((img, i) => {
          const contact = img as FilteredProps;
          return (
            <label key={i} className="swap swap-flip text-9xl">
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact)}
                onChange={() => handleCommunicationMethodChange(contact)}
              />
              <div className="swap-on ring ring-green-600 rounded-full p-2">
                <Image src={`/${img}.png`} alt={img} width={40} height={40} />
              </div>

              <div className="swap-off rounded-full p-2">
                <Image src={`/${img}.png`} alt={img} width={40} height={40} />
              </div>
            </label>
          );
        })}
      </div>
      <div className="flex flex-col gap-4">
        {selectedContacts.length > 0 &&
          selectedContacts.map((contact, i) => (
            <Input
              key={i}
              value={linkValue?.[contact] ?? ''}
              name={contact}
              label={`${contact.charAt(0).toUpperCase()}${contact.slice(1)}`}
              onChange={onInputChange}
            />
          ))}
        <Input
          label="Github"
          name="github"
          value={linkValue?.github || ''}
          onChange={(e) => onInputChange(e)}
        />
      </div>
    </div>
  );
}

function Roles({ roles, role, userAccountRole, handleRole }: RolesProps) {
  return (
    <div className="Role">
      Role
      <div className="grid grid-cols-3 gap-2 mt-2">
        {roles.map((userRole) => (
          <button
            key={userRole}
            className={`btn ${
              !role && userAccountRole === userRole && 'btn-primary'
            } ${role === userRole && 'btn-primary'}`}
            onClick={() => handleRole(userRole)}
          >
            {userRole}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProfileModal({ show, hideModal }: ProfileModalProps) {
  const { initializeUser } = useInitialiseUser();
  const { userAccount } = useAccounts();
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [role, setRole] = useState<string | undefined>();
  const [pfp, setPfp] = useState<string>('');
  const [github, setGithub] = useState<string | null>(null);

  const [links, setLinks] = useState<UserLinkProps>({
    discord: null,
    telegram: null,
    twitter: null,
    github: null,
  });

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

  const handleRole = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const handleSubmit = () => {
    if (role) {
      initializeUser.mutateAsync({
        name,
        about,
        role,
        pfp,
        links,
      });
    }
  };

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
            <Avatar onFileUpload={handleFileUpload} src={pfp} />
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
          <div className="w-full">
            <Roles
              roles={['Freelancer', 'Client', 'Voter']}
              role={role}
              userAccountRole={userAccount.data?.role}
              handleRole={handleRole}
            />
          </div>

          <Links
            userAccountLinks={userAccount.data?.links as UserLinkProps}
            onInputChange={handleInputChange}
          />
        </div>
        <div className="w-full text-end mt-4">
          <button onClick={handleSubmit} className="btn">
            Create account
          </button>
        </div>
      </div>
    </AppModal>
  );
}
