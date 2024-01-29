import { useExchange } from '@/hooks/exchange';
import { useAccounts } from '@/hooks/get-accounts';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';

interface EscrowProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

export default function Exchange() {
  const { userRequests } = useAccounts();
  const { exchange } = useExchange();
  const [data, setData] = useState<EscrowProps>();

  const handleSubmit = () => {
    if (data) {
      exchange.mutateAsync(data);
    }
  };

  return (
    <>
      {userRequests.data?.map((escrow) => {
        return (
          <div
            key={escrow.publicKey.toString()}
            onClick={() =>
              setData({
                escrow: escrow.publicKey,
                initializer: escrow.account.initializer,
              })
            }
          >
            {escrow.account.about}
          </div>
        );
      })}
      <button className="btn" onClick={handleSubmit} disabled={!data}>
        Exchange
      </button>
    </>
  );
}
