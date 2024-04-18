'use client';

import React from 'react';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';
import { Assets } from '@/types/search-assets';

interface ValidateActionsProps {
  onAcceptClick: () => void;
  onDeclineClick: () => void;
  escrow?: anchor.IdlAccounts<AnchorEscrow>['escrow'] | null;
  collections?: Assets;
  isPending: boolean;
}

export default function ValidateActions({
  onAcceptClick,
  onDeclineClick,
  escrow,
  collections,
  isPending,
}: ValidateActionsProps) {
  const handleAcceptClick = () => {
    onAcceptClick();
  };

  const handleDeclineClick = () => {
    onDeclineClick();
  };

  return (
    <div className="flex w-full justify-between">
      <button
        onClick={() => handleAcceptClick()}
        className="btn bg-black text-white w-[49%]"
        disabled={
          collections
            ? escrow?.status !== 'validate' ||
              collections?.result.items.length < 1 ||
              isPending
            : escrow?.status !== 'validate' || isPending
        }
      >
        Accept Work
      </button>

      <button
        onClick={() => handleDeclineClick()}
        className="btn bg-black text-white w-[49%]"
        disabled={
          collections
            ? escrow?.status !== 'validate' ||
              collections?.result.items.length < 1 ||
              isPending
            : escrow?.status !== 'validate' || isPending
        }
      >
        Decline Work
      </button>
    </div>
  );
}
