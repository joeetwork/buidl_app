'use client';

import { useAuth } from '@/hooks/user-auth';
import dynamic from 'next/dynamic';

const Button = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function WalletButton() {
  useAuth();

  return <Button />;
}
