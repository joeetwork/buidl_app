import React from 'react';
import { AppHero } from '../shared/app-hero';
import User from '../modals/user';

export default function CreateUser() {
  return (
    <AppHero title="Create Account" subtitle="Add your user details here">
      <User />
    </AppHero>
  );
}
