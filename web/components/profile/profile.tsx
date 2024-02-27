'use client';

import React, { useState } from 'react';
import { useAccounts } from '@/hooks/get-accounts';
import Avatar from '../shared/avatar';
import Image from 'next/image';
import HistoryModal from './history-modal';
import ProfileModal from './profile-modal';

export default function Profile() {
  const { userAccount } = useAccounts();
  const [historyModal, setHistoryModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [modalData, setModalData] = useState<string>();

  const pfp =
    userAccount.data?.pfp ||
    'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg';

  const renderUsername =
    userAccount.data?.username === userAccount.data?.initializer?.toString()
      ? 'Guest'
      : userAccount.data?.username;

  const showHistory = (role: string) => {
    setHistoryModal(true);
    setModalData(role);
  };

  return (
    <>
      <div className="flex flex-col gap-4 mx-[8%] h-full">
        <div className="bg-gradient-to-b from-emerald-500 via-transparent to-transparent row-span-2 relative w-full flex-2">
          <div className="ml-6 mt-6">
            <Avatar src={pfp} />
          </div>

          <div className="grid grid-cols-2 pb-4 px-6">
            <div>
              <h1 className="text-2xl truncate">{renderUsername}</h1>
              <h3 className="text-xs truncate">
                {userAccount.data?.initializer.toString()}
              </h3>
            </div>

            <button
              className="w-[40%] ml-auto btn"
              onClick={() => setProfileModal(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-5 gap-4 pb-4">
          <div className="grid grid-rows-12 gap-4 md:col-span-2 bg-red-800 p-6 lg:p-2 xl:p-6">
            <div className="row-span-5">
              <h1 className="text-xl">Bio</h1>
              <p className="text-sm mt-2">
                {userAccount.data?.about
                  ? userAccount.data.about
                  : 'Edit profile to add a bio'}
              </p>
            </div>

            <div className="row-span-2">
              <h1 className="text-xl">Role</h1>
              <div className="grid grid-rows-3 md:grid-rows-1 lg:grid lg:grid-cols-3 gap-2 mt-2">
                {['Freelancer', 'Client', 'Votorrr'].map((role) => (
                  <button key={role} className="btn">
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="row-span-5">
              <h1 className="text-xl">Links</h1>
              <div className="flex flex-col mt-2 gap-4">
                {['twitter', 'discord', 'telegram', 'github'].map((link) => {
                  const linkKey = link as
                    | 'twitter'
                    | 'discord'
                    | 'telegram'
                    | 'github';

                  return (
                    userAccount.data?.[linkKey] && (
                      <div key={link} className="flex items-center gap-2">
                        <Image
                          src={`/${link}.png`}
                          alt={link}
                          width={30}
                          height={30}
                        />
                        <p>{userAccount.data[linkKey]}</p>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          </div>

          <div className="contents md:grid md:grid-row-2 gap-4 md:col-span-3">
            <div className="flex flex-col md:row-span-1 bg-gray-800">
              <h2 className="mt-2 ml-2">Badges</h2>
              <p className="m-auto">Coming Soon</p>
            </div>

            <div className="flex flex-col md:row-span-1 bg-gray-800">
              <p className="mt-2 ml-2">History</p>
              <div className="flex justify-evenly my-auto">
                <button className="btn" onClick={() => showHistory('client')}>
                  Client History
                </button>
                <button
                  className="btn"
                  onClick={() => showHistory('freelancer')}
                >
                  Freelance History
                </button>
                <button className="btn">Voting History</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal
        hideModal={() => setProfileModal(false)}
        show={profileModal}
      />

      <HistoryModal
        role={modalData}
        hideModal={() => setHistoryModal(false)}
        show={historyModal}
      />
    </>
  );
}
