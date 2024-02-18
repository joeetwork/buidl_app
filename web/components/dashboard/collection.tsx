'use client';

import React from 'react';

export default function Collection() {
  return (
    <>
      <div className="flex justify-between gap-4">
        <div className="card w-full bg-base-100 shadow-xl h-56">
          <p className="text-center pt-2">Stats</p>
        </div>
        <div className="card w-full bg-base-100 shadow-xl h-56">
          <p className="text-center pt-2">History</p>
        </div>
      </div>

      <div className="flex card w-full bg-base-100 shadow-xl min-h-[250px]">
        <p className="text-center pt-2">Active</p>
      </div>
    </>
  );
}
