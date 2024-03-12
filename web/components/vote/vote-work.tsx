'use client';
import React from 'react';

interface VoteWorkProps {
  onChange: (e: string) => void;
}

export default function VoteWork({ onChange }: VoteWorkProps) {
  return (
    <div
      className={`bg-gray-500 rounded-lg p-4 w-full hover:ring hover:ring-gray-700`}
    >
      <div className="w-full">
        <span className="label-text cursor-default">Contracts</span>
      </div>
    </div>
  );
}
