import React from 'react';

interface TextAreaProps {
  label?: string;
  value: string;
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea({
  label,
  value,
  name,
  onChange,
}: TextAreaProps) {
  return (
    <label className="form-control w-full">
      {label && (
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
      )}

      <textarea
        placeholder="About"
        name={name}
        className="textarea textarea-bordered textarea-md w-full focus:outline-none max-w-x resize-none"
        onChange={(e) => onChange(e)}
        value={value}
      />
    </label>
  );
}
