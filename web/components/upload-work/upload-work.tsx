import React, { useState } from 'react';
import Input from '../shared/input';
import { useAccounts } from '@/hooks/get-accounts';
import { PublicKey } from '@solana/web3.js';
import { useUpload } from '@/hooks/upload';

interface ClickProps {
  escrow: PublicKey;
  initializer: PublicKey;
}

export default function UploadWork() {
  const { userRequests } = useAccounts();
  const [data, setData] = useState<ClickProps>();
  const [link, setLink] = useState('');
  const { uploadWork } = useUpload();

  const handleClick = ({ escrow, initializer }: ClickProps) => {
    setData({ escrow, initializer });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleSubmit = () => {
    if (data) {
      uploadWork.mutateAsync({
        escrow: data.escrow,
        initializer: data?.initializer,
        link,
      });
    }
  };

  return (
    <div>
      {userRequests.data?.map((escrow) => {
        return (
          <div
            key={escrow.publicKey.toString()}
            onClick={() =>
              handleClick({
                escrow: escrow.publicKey,
                initializer: escrow.account.initializer,
              })
            }
          >
            {escrow.account.about}
          </div>
        );
      })}
      <Input label="Upload work" value={link} onChange={handleChange} />

      <button
        className="btn"
        onClick={handleSubmit}
        disabled={uploadWork.isPending}
      >
        Upload Work
      </button>
    </div>
  );
}
