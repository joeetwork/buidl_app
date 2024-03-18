'use client';

import Image from 'next/image';
import React, { ChangeEvent, useRef } from 'react';

interface AvatarProps {
  onFileUpload?: (e: ChangeEvent<HTMLInputElement>) => void;
  src: string;
}

export default function Avatar({ onFileUpload, src }: AvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderCamera = () => {
    return (
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
    );
  };

  return (
    <div className="avatar">
      <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
        {onFileUpload && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileUpload}
            />
            <button
              className="absolute top-[30px] left-[30px] rounded-full bg-black w-[40%] h-[40%] opacity-50 hover:opacity-30"
              onClick={handleIconClick}
            >
              {renderCamera()}
            </button>
          </>
        )}
        <Image
          unoptimized={true}
          loader={() => (src ? src : '/template_pfp.png')}
          src={src ? src : '/template_pfp.png'}
          alt="pfp"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}
