'use client';

import React from 'react';

export default function VoteInfo() {
  return (
    <div
      className={`bg-gray-500 rounded-lg p-4 hover:ring hover:ring-gray-700 w-full`}
    >
      <div className="w-full">
        <span className="label-text cursor-default">Contract Information</span>
      </div>
      <div className="flex justify-between w-full"></div>
    </div>
  );
}
