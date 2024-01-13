'use client';

import { Keypair, PublicKey } from '@solana/web3.js';

import { ExplorerLink } from '../cluster/cluster-ui';
import { ellipsify } from '../shared/ellipsify';
import {
  useEscrowProgram,
  useEscrowProgramAccount,
} from './escrow-data-access';

export function EscrowCreate() {
  const { initialize } = useEscrowProgram();

  return (
    <button
      className="btn btn-xs lg:btn-md btn-primary"
      onClick={() => initialize.mutateAsync(Keypair.generate())}
      disabled={initialize.isPending}
    >
      Create {initialize.isPending && '...'}
    </button>
  );
}

export function EscrowList() {
  const { escrowAccounts, getProgramAccount } = useEscrowProgram();

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
  const { account, exchange, close } = useEscrowProgramAccount({
    vault,
  });

  return account.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
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
              onClick={() => close.mutateAsync()}
              disabled={close.isPending}
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
                if (
                  !window.confirm(
                    'Are you sure you want to close this account?'
                  )
                ) {
                  return;
                }
                return close.mutateAsync();
              }}
              disabled={close.isPending}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
