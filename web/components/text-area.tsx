import React from 'react';

interface TextAreaProps {
  label?: string;
  value: string;
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea({ label, value, onChange }: TextAreaProps) {
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
          onChange={(e) => onChange(e)}
          value={value}
        />
      </div>
    </div>
  );
}
