'use client';

import React from 'react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';
import { useRequests } from '@/hooks/requests';
import { PublicKey } from '@solana/web3.js';

interface RequestProps {
  escrow?: PublicKey;
  initializer?: PublicKey;
}

interface RequestActionsProps {
  escrow?: {
    account: anchor.IdlAccounts<AnchorEscrow>['escrow'] | null;
    publicKey: PublicKey;
  } | null;
}

export default function RequestActions({ escrow }: RequestActionsProps) {
  const { declineRequest, acceptRequest } = useRequests();

  const handleAcceptClick = ({ escrow, initializer }: RequestProps) => {
    if (escrow && initializer) {
      acceptRequest.mutateAsync({
        escrow,
        initializer,
      });
    }
  };

  const handleDeclineClick = ({ escrow, initializer }: RequestProps) => {
    if (escrow && initializer) {
      declineRequest.mutateAsync({
        escrow,
        initializer,
      });
    }
  };

  return (
    <div className="flex w-full justify-between">
      <button
        onClick={() =>
          handleAcceptClick({
            escrow: escrow?.publicKey,
            initializer: escrow?.account?.initializer,
          })
        }
        className="btn bg-black text-white w-[49%]"
        disabled={
          escrow?.account?.status !== 'request' || acceptRequest.isPending
        }
      >
        Accept Work
      </button>

      <button
        onClick={() =>
          handleDeclineClick({
            escrow: escrow?.publicKey,
            initializer: escrow?.account?.initializer,
          })
        }
        className="btn bg-black text-white w-[49%]"
        disabled={
          escrow?.account?.status !== 'request' || declineRequest.isPending
        }
      >
        Decline Work
      </button>
    </div>
  );
}
