import { AppHero } from '@/components/shared/app-hero';
import CreateUser from '@/components/user/create-user';

export default function Page() {
  return (
    <AppHero title={'Sign Up'} subtitle={'Enter your details below'}>
      <CreateUser />
    </AppHero>
  );
}
