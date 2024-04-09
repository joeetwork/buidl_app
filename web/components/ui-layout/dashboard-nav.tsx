import { useAccounts } from '@/hooks/get-accounts';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function DashboardNav() {
  const { userAccount } = useAccounts();
  const [nav, setNav] = useState<string[]>([]);

  useEffect(() => {
    const NAV =
      userAccount.data?.role === 'Freelancer'
        ? ['Contracts', 'Requests', 'Vote']
        : ['Contracts', 'Vote'];

    setNav(NAV);
  }, [userAccount.data?.role]);

  return (
    <div className="w-full bg-blue-600 flex justify-around px-32">
      {nav.map((item, idx) => {
        return (
          <Link
            key={idx}
            href={item === 'Contracts' ? '/' : item.toLowerCase()}
          >
            {item}
          </Link>
        );
      })}
    </div>
  );
}
