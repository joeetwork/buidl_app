'use client';

import React, { useState } from 'react';
import VoteInfo from './vote-info';
import VoteActions from './vote-actions';
import VoteContracts from './vote-contracts';
import { PublicKey } from '@solana/web3.js';
import { useValidateUser } from '@/hooks/validate';

export default function UserVote() {
  const [contract, setContract] = useState<PublicKey | null>(null);
  const {
    validatorUserEscrows,
    validatorUserEscrow,
    acceptWithUser,
    declineWithUser,
  } = useValidateUser(contract);

  const handleAcceptClick = () => {
    if (contract) {
      acceptWithUser.mutateAsync({
        escrow: contract,
      });
    }
  };

  const handleDeclineClick = () => {
    if (contract) {
      declineWithUser.mutateAsync({
        escrow: contract,
      });
    }
  };

  return (
    <>
      <VoteContracts
        escrows={validatorUserEscrows.data?.filter(
          (escrow) => escrow.account.status === 'validate'
        )}
        onClick={(e) => setContract(e)}
      />

      <VoteInfo escrow={validatorUserEscrow.data} />

      <VoteActions
        onAcceptClick={handleAcceptClick}
        onDeclineClick={handleDeclineClick}
        escrow={validatorUserEscrow.data}
        isPending={validatorUserEscrow.isPending}
      />
    </>
  );
}
