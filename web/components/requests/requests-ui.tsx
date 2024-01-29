'use client';

import { useDeclineRequest } from '@/hooks/declineRequest';
import { useAccounts } from '@/hooks/get-accounts';
import { PublicKey } from '@solana/web3.js';

import React from 'react';

interface RequestProps {
  pda: PublicKey;
  initializer: PublicKey;
}

export default function RequestsUi() {
  const { userRequests } = useAccounts();
  const { declineRequest } = useDeclineRequest();

  const handleSubmit = ({ pda, initializer }: RequestProps) => {
    declineRequest.mutateAsync({ pda, initializer });
  };

  return (
    <>
      {userRequests.data?.map((request) => {
        <div>
          <div>{request.account.initializer.toString()}</div>

          <div>name or pubkey</div>

          <div>amount: {request.account.initializerAmount.toString()}</div>

          <div>{request.account.about}</div>

          <div>
            Verified collection: {request.account.verifiedCollection.toString()}
          </div>

          <div>
            Amount of validators:{' '}
            {request.account.validatorTotalCount.toString()}
          </div>

          <div>accept</div>

          <div
            onClick={() =>
              handleSubmit({
                pda: request.publicKey,
                initializer: request.account.initializer,
              })
            }
          >
            decline
          </div>
        </div>;
      })}
    </>
  );
}
