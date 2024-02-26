import Image from 'next/image';
import React from 'react';

interface AvatarProps {
  src: string;
}

export default function Avatar({ src }: AvatarProps) {
  return (
    <div className="avatar">
      <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
        <Image
          unoptimized={true}
          loader={() => src}
          src={src}
          alt="pfp"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}
