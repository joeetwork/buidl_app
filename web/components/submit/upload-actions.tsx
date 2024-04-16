'use client';

import React, { useState } from 'react';
import Input from '../shared/input';
import { useUpload } from '@/hooks/upload';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';

interface UploadProps {
  escrow?: PublicKey;
  initializer?: PublicKey;
}

interface UploadActionsProps {
  escrow?: {
    account: anchor.IdlAccounts<AnchorEscrow>['escrow'] | null;
    publicKey: PublicKey;
  } | null;
}

export default function UploadActions({ escrow }: UploadActionsProps) {
  const { uploadWork } = useUpload();
  const [link, setLink] = useState('');

  const handleUpload = ({ escrow, initializer }: UploadProps) => {
    if (escrow && initializer && link) {
      uploadWork.mutateAsync({
        escrow: escrow,
        initializer: initializer,
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
            escrow: escrow?.publicKey,
            initializer: escrow?.account?.initializer,
          })
        }
        disabled={escrow?.account?.status !== 'upload' || uploadWork.isPending}
      >
        Upload Work
      </button>
    </div>
  );
}
