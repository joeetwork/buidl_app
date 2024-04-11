'use client';

import { useRequests } from '@/hooks/requests';
import { PublicKey } from '@solana/web3.js';
import React from 'react';

interface RequestProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

export default function Request({ escrow, initializer }: RequestProps) {
  const { declineRequest, acceptRequest } = useRequests();

  const handleDecline = (data: RequestProps) => {
    declineRequest.mutateAsync(data);
  };

  const handleAccept = (data: RequestProps) => {
    acceptRequest.mutateAsync(data);
  };

  return (
    <div className="flex gap-4">
      <button
        className="btn btn-primary"
        onClick={() =>
          handleAccept({
            escrow,
            initializer,
          })
        }
      >
        accept
      </button>
      <button
        className="btn btn-primary"
        onClick={() =>
          handleDecline({
            escrow,
            initializer,
          })
        }
      >
        decline
      </button>
    </div>
  );
}
