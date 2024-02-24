'use client';
import React, { useState } from 'react';

interface OfferAboutProps {
  onChange: (e: string) => void;
}

export default function OfferAboutInput({ onChange }: OfferAboutProps) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={`bg-gray-500 rounded-lg p-4 w-full hover:ring ${
        isHighlighted ? 'ring ring-gray-400' : 'hover:ring-gray-700'
      }`}
    >
      <div className="w-full">
        <span className="label-text cursor-default">Your offer</span>
      </div>
      <textarea
        className="textarea textarea-lg w-full p-0 resize-none bg-gray-500 focus:outline-none"
        name="about"
        onFocus={() => setIsHighlighted(true)}
        onBlur={() => setIsHighlighted(false)}
        placeholder="Gm, I've got an exciting opportunity for you..."
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
}
