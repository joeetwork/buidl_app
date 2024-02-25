'use client';

import React, { useState } from 'react';
import { useInitialiseUser } from '@/hooks/initialize-user';

export default function Profile() {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [isFreelance, setIsFreelance] = useState(false);
  const [pfp, setPfp] = useState<string | null>(null);
  const [discord, setDiscord] = useState<string | null>(null);
  const [telegram, setTelegram] = useState<string | null>(null);
  const [twitter, setTwitter] = useState<string | null>(null);
  const [github, setGithub] = useState<string | null>(null);

  const { initializeUser } = useInitialiseUser();

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
    <>
      <div className="flex flex-col gap-4 pb-4 items-center">
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="John Doe"
          className="input input-ghost input-lg p-0 text-4xl bg-gray-500 focus:outline-none w-full"
        />

        <input
          onChange={(e) => setAbout(e.target.value)}
          type="text"
          placeholder="Tell us about you/your company"
          className="input input-ghost input-lg p-0 text-4xl bg-gray-500 focus:outline-none w-full"
        />
        <span>
          {isFreelance ? 'Freelancer' : 'Other'}
          <input
            type="checkbox"
            className="toggle"
            checked={isFreelance}
            onChange={() => setIsFreelance(!isFreelance)}
          />
        </span>

        <input
          onChange={(e) => setPfp(e.target.value)}
          type="text"
          placeholder="Add your pfp"
          className="input input-ghost input-lg p-0 text-4xl bg-gray-500 focus:outline-none w-full"
        />

        <input
          onChange={(e) => setDiscord(e.target.value)}
          type="text"
          placeholder="Add your discord"
          className="input input-ghost input-lg p-0 text-4xl bg-gray-500 focus:outline-none w-full"
        />

        <input
          onChange={(e) => setTelegram(e.target.value)}
          type="text"
          placeholder="add your telegram"
          className="input input-ghost input-lg p-0 text-4xl bg-gray-500 focus:outline-none w-full"
        />

        <input
          onChange={(e) => setTwitter(e.target.value)}
          type="text"
          placeholder="Add your twitter"
          className="input input-ghost input-lg p-0 text-4xl bg-gray-500 focus:outline-none w-full"
        />

        <input
          onChange={(e) => setGithub(e.target.value)}
          type="text"
          placeholder="Add your github"
          className="input input-ghost input-lg p-0 text-4xl bg-gray-500 focus:outline-none w-full"
        />
      </div>
      <button onClick={handleSubmit} className="btn">
        Create account
      </button>
    </>
  );
}
