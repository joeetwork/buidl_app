'use client';

import React, { useState } from 'react';
import Input from '../shared/input';
import { useUpload } from '@/hooks/upload';
import { PublicKey } from '@solana/web3.js';

interface UploadProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

export default function Upload({ escrow, initializer }: UploadProps) {
  const { uploadWork } = useUpload();
  const [link, setLink] = useState('');

  const handleUpload = (data: UploadProps) => {
    if (link) {
      uploadWork.mutateAsync({
        escrow: data.escrow,
        initializer: data?.initializer,
        link,
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Input
        value={link}
        label="Upload work"
        onChange={(e) => setLink(e.target.value)}
      />

      <button
        className="btn btn-primary w-full"
        onClick={() =>
          handleUpload({
            escrow,
            initializer,
          })
        }
        disabled={uploadWork.isPending}
      >
        Upload Work
      </button>
    </div>
  );
}
