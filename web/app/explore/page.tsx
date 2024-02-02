import ExploreUi from '@/components/explore/explore-ui';
import { AppHero } from '@/components/shared/app-hero';
import React from 'react';

export default function page() {
  return (
    <AppHero title={'Explore'} subtitle={'Find the expertise you desire!'}>
      <ExploreUi />
    </AppHero>
  );
}
