import { SUBPAGES } from '@/constants';
import { useAccounts } from '@/hooks/get-accounts';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardNav() {
  const { userAccount } = useAccounts();
  const [nav, setNav] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const NAV =
      userAccount.data?.role === 'Freelancer'
        ? ['Requests', 'Claim', 'Submit', 'Vote']
        : ['Contracts', 'Vote'];

    if (userAccount.data?.role === 'Client') {
      router.push('/contracts');
    }

    if (userAccount.data?.role === 'Freelancer') {
      router.push('/requests');
    }

    setNav(NAV);
  }, [userAccount.data?.role]);

  return (
    <div className="w-full bg-blue-600 flex justify-around px-32">
      {nav.map((item, idx) => {
        return (
          <Link key={idx} href={item.toLowerCase()}>
            {item === 'Contracts' ? 'Active' : item}
          </Link>
        );
      })}
    </div>
  );
}
