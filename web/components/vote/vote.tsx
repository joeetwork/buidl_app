'use client';

import Collection from './collection';
import SingleValidator from './singleValidator';

export default function Vote() {
  return (
    <div>
      <SingleValidator />
      <Collection />
    </div>
  );
}
