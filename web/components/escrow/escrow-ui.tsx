'use client';

import { PublicKey } from '@solana/web3.js';

import { ExplorerLink } from '../cluster/cluster-ui';
import { ellipsify } from '../shared/ellipsify';
import { useEffect, useState } from 'react';
import { useInitialiseEscrow } from '@/instructions/initialize-escrow';
import { useInitialiseUser } from '@/instructions/initialize-user';
import { useAccounts } from '@/instructions/get-accounts';
import { useExchange } from '@/instructions/exchange';
import { useCancel } from '@/instructions/cancel';
import { useDeclineRequest } from '@/instructions/declineRequest';
import { useValidate } from '@/instructions/validate';
import { useUpload } from '@/instructions/upload_work';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import Modal from '../modal';
import User from '../modals/user';
import Escrow from '../modals/escrow';

export function EscrowCreate() {
  // const { userAccounts } = useAccounts();
  const { initializeEscrow } = useInitialiseEscrow();
  const { initializeUser } = useInitialiseUser();

  // useEffect(() => {
  //   console.log(userAccounts.data);
  // }, [userAccounts, userAccounts.isLoading]);

  return (
    <>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={() => initializeEscrow.mutateAsync(1)}
        disabled={initializeEscrow.isPending}
      >
        Create {initializeEscrow.isPending && '...'}
      </button>

      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={() => initializeUser.mutateAsync('joe')}
        disabled={initializeUser.isPending}
      >
        Create user {initializeUser.isPending && '...'}
      </button>
    </>
  );
}

export function EscrowList() {
  const { escrowAccounts, getProgramAccount } = useAccounts();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {escrowAccounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : escrowAccounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {escrowAccounts.data?.map((account) => (
            <EscrowCard
              key={account.publicKey.toString()}
              vault={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No Counters</h2>
          No counters found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function EscrowCard({ vault }: { vault: PublicKey }) {
  const { exchange } = useExchange();

  const { cancel } = useCancel();

  const { declineRequest } = useDeclineRequest();

  const { validate } = useValidate();

  const { uploadWork } = useUpload();

  // const { publicKey } = useWallet();

  // const { data, isLoading } = useQuery({
  //   queryKey: ['test'],
  //   queryFn: async () => {
  //     const res = await fetch('/api/helius', {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         ownerAddress: publicKey?.toBase58(),
  //       }),
  //     });
  //     const data = res.json();
  //     return data;
  //   },
  // });

  // useEffect(() => {
  //   console.log(data, isLoading);
  // }, [data, isLoading]);

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <div className="card-actions justify-around">
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => exchange.mutateAsync()}
              disabled={exchange.isPending}
            >
              Exchange
            </button>
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => cancel.mutateAsync()}
              disabled={cancel.isPending}
            >
              Close
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${vault}`}
                label={ellipsify(vault.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                return validate.mutateAsync();
              }}
              disabled={validate.isPending}
            >
              Validate
            </button>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                return declineRequest.mutateAsync();
              }}
              disabled={declineRequest.isPending}
            >
              Decline
            </button>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                return uploadWork.mutateAsync();
              }}
              disabled={uploadWork.isPending}
            >
              Upload
            </button>
            <button onClick={() => setIsOpen(!isOpen)}>open modal</button>
            {/* <Modal
              title="Create Account"
              isOpen={isOpen}
              onClose={() => setIsOpen(!isOpen)}
              onSubmit={handleSubmit}
            >
              <User />
            </Modal> */}

            <Modal
              title="Job Offer"
              isOpen={isOpen}
              onClose={() => setIsOpen(!isOpen)}
              onSubmit={handleSubmit}
            >
              <Escrow
                collection={['']}
                onChangeAmount={() => {
                  return;
                }}
                onChangeAbout={() => {
                  return;
                }}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
