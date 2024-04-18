'use client';

import React, { useEffect, useState } from 'react';
import Input from '../shared/input';
import Image from 'next/image';
import { FilteredProps, LinksProps } from '@/types/profile';

export function UserLinks({ userAccountLinks, onInputChange }: LinksProps) {
  const [selectedContacts, setSelectedContacts] = useState<FilteredProps[]>([]);

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
              <div className="swap-on ring ring-teal-400 rounded-full p-2">
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
              value={userAccountLinks?.[contact] ?? ''}
              name={contact}
              label={`${contact.charAt(0).toUpperCase()}${contact.slice(1)}`}
              onChange={onInputChange}
            />
          ))}
        {/* <Input
          label="Github"
          name="github"
          value={userAccountLinks?.github || ''}
          onChange={(e) => onInputChange(e)}
        /> */}
      </div>
    </div>
  );
}
