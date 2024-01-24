import React from 'react';

interface TextAreaProps {
  label?: string;
  onChange: () => void;
}

export default function TextArea({ label, onChange }: TextAreaProps) {
  return (
    <div>
      {label && (
        <div className="text-left">
          <label>{label}</label>
        </div>
      )}
      <div>
        <textarea
          placeholder="Bio"
          className="textarea textarea-bordered textarea-md w-full max-w-xs"
          onChange={onChange}
        ></textarea>
      </div>
    </div>
  );
}
