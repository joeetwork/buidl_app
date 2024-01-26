import { useExchange } from '@/instructions/exchange';
import { useAccounts } from '@/instructions/get-accounts';
import { PublicKey } from '@solana/web3.js';
import React, { useState } from 'react';

interface EscrowProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

export default function Exchange() {
  const { userRequests } = useAccounts();
  const { exchange } = useExchange();
  const [data, setData] = useState<EscrowProps | undefined>();

  const handleClick = () => {
    if (data) {
      exchange.mutateAsync(data);
    }
  };

  const handleSubmit = ({ escrow, initializer }: EscrowProps) => {
    setData({ escrow, initializer });
  };

  return (
    <>
      {userRequests.data?.map((escrow) => {
        return (
          <div
            key={escrow.publicKey.toString()}
            onClick={() =>
              handleSubmit({
                escrow: escrow.publicKey,
                initializer: escrow.account.initializer,
              })
            }
          >
            {escrow.account.about}
          </div>
        );
      })}
      <button className="btn" onClick={handleClick} disabled={!data}>
        Exchange
      </button>
    </>
  );
}
