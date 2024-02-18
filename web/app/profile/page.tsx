'use client';

import { AppHero } from '@/components/shared/app-hero';
import CreateUser from '@/components/user/create-user';
import { useAccounts } from '@/hooks/get-accounts';

export default function Page() {
  const { userAccount } = useAccounts();

  return (
    <>
      {userAccount.data ? (
        <AppHero title={'Profile'} subtitle={'Subtitle'}>
          <div>Change profile details here</div>
        </AppHero>
      ) : (
        <AppHero title={'Profile'} subtitle={'Sign up'}>
          <CreateUser />
        </AppHero>
      )}
    </>
  );
}
