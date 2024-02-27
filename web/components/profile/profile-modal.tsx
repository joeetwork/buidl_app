'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import { useInitialiseUser } from '@/hooks/initialize-user';
import { useAccounts } from '@/hooks/get-accounts';
import { AppModal } from '../shared/app-modal';
import Image from 'next/image';

interface ProfileModalProps {
  show: boolean;
  hideModal: () => void;
}

export default function ProfileModal({ show, hideModal }: ProfileModalProps) {
  const { initializeUser } = useInitialiseUser();
  const { userAccount } = useAccounts();
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [isFreelance, setIsFreelance] = useState(false);
  const [pfp, setPfp] = useState(
    userAccount.data?.pfp ||
      'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'
  );
  const [discord, setDiscord] = useState<string | null>(null);
  const [telegram, setTelegram] = useState<string | null>(null);
  const [twitter, setTwitter] = useState<string | null>(null);
  const [github, setGithub] = useState<string | null>(null);
  const [selectedBtn, setSelectedBtn] = useState<number>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderUsername =
    userAccount.data?.username === userAccount.data?.initializer?.toString()
      ? undefined
      : userAccount.data?.username;

  const handleIconClick = () => {
    if (!fileInputRef.current) {
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files?.length > 0) {
      const file = e.target.files[0];

      console.log('File uploaded:', file);
    }
  };

  interface RoleProps {
    role: string;
    index: number;
  }

  const handleRole = ({ role, index }: RoleProps) => {
    setSelectedBtn(index);

    if (role === 'freelancer') {
      setIsFreelance(true);
    } else {
      setIsFreelance(false);
    }
  };

  const handleSubmit = () => {
    initializeUser.mutateAsync({
      name,
      about,
      freelancer: isFreelance,
      pfp,
      discord,
      telegram,
      twitter,
      github,
    });
  };

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
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  className="absolute top-[30px] left-[30px] rounded-full bg-black w-[40%] h-[40%] opacity-50 hover:opacity-30"
                  onClick={handleIconClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-1/2 m-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                    />
                  </svg>
                </button>
                <Image
                  unoptimized={true}
                  loader={() => pfp}
                  src={pfp}
                  alt="pfp"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            Name
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              defaultValue={renderUsername}
              placeholder="John Doe"
              className="input input-ghost bg-gray-500 w-full"
            />
          </div>

          <div className="w-full">
            Bio
            <textarea
              className="textarea textarea-lg w-full resize-none bg-gray-500"
              name="about"
              placeholder="Tell us about yourself/your company"
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          <div className="w-full">
            Role
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['Freelancer', 'Client', 'Votorrr'].map((role, i) => (
                <button
                  key={role}
                  className={`btn ${i === selectedBtn && 'btn-primary'}`}
                  onClick={() => handleRole({ role, index: i })}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full">
            Discord
            <input
              onChange={(e) => setDiscord(e.target.value)}
              type="text"
              placeholder="Add your discord"
              className="input input-ghost bg-gray-500 w-full"
            />
          </div>

          <div className="w-full">
            Telegram
            <input
              onChange={(e) => setTelegram(e.target.value)}
              type="text"
              placeholder="add your telegram"
              className="input input-ghost bg-gray-500 w-full"
            />
          </div>

          <div className="w-full">
            Twitter
            <input
              onChange={(e) => setTwitter(e.target.value)}
              type="text"
              placeholder="Add your twitter"
              className="input input-ghost bg-gray-500 w-full"
            />
          </div>

          <div className="w-full">
            Github
            <input
              onChange={(e) => setGithub(e.target.value)}
              type="text"
              placeholder="Add your github"
              className="input input-ghost bg-gray-500 w-full"
            />
          </div>
        </div>
        <button onClick={handleSubmit} className="btn">
          Create account
        </button>
      </div>
    </AppModal>
  );
}
