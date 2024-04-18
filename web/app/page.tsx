'use client';

import { AppHero } from '@/components/shared/app-hero';
import { useAccounts } from '@/hooks/get-accounts';
import Link from 'next/link';

export default function Page() {
  const { userAccount } = useAccounts();
  return (
    <AppHero title="Gigd" subtitle="Trust nobody and get rewarded">
      {userAccount.data?.role === 'Freelancer' ? (
        <Link href="/requests" className="btn bg-teal-600 text-white">
          Start Earning
        </Link>
      ) : (
        <Link href="/explore" className="btn bg-teal-600 text-white">
          Discover talent
        </Link>
      )}
    </AppHero>
  );
}
