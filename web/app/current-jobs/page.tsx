import CurrentJobs from '@/components/current-jobs/current-jobs';
import { AppHero } from '@/components/shared/app-hero';
import React from 'react';

export default function Page() {
  return (
    <AppHero title={'Current Jobs'} subtitle={'Check out your jobs here!'}>
      <CurrentJobs />
    </AppHero>
  );
}
