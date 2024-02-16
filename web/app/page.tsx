'use client';

import { AppHero } from '@/components/shared/app-hero';
import CreateUser from '@/components/user/create-user';
import { useAccounts } from '@/hooks/get-accounts';

export default function Page() {
  const { userAccount } = useAccounts();

  return (
    <>
      {userAccount.data ? (
        <AppHero title={'Title'} subtitle={'Subtitle'}>
          <div>new</div>
        </AppHero>
      ) : (
        <CreateUser />
      )}
    </>
  );
}
