'use client';

import { useWallet } from '@solana/wallet-adapter-react';

import { ExplorerLink } from '../cluster/cluster-ui';

import { AppHero } from '../shared/app-hero';
import { WalletButton } from '../shared/wallet-button';
import { ellipsify } from '../shared/ellipsify';
import { EscrowCreate, EscrowList } from './escrow-ui';
import { useAccounts } from '@/instructions/get-accounts';

export default function EscrowFeature() {
  const { publicKey } = useWallet();
  const { programId } = useAccounts();

  return publicKey ? (
    <div>
      <AppHero
        title="Escrow"
        subtitle={
          'You can create a new counter by clicking the "Create" button. The state of a counter is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <EscrowCreate />
      </AppHero>
      <EscrowList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
