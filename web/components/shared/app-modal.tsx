'use client';

import React, { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }

    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hide();
      } else if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, dialogRef, hide]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5 h-3/4 w-[30%]">
        <div className="flex justify-between w-full">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={hide} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button
                className="btn lg:btn-md btn-primary"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button className="cursor-default" onClick={hide}>
          close
        </button>
      </form>
    </dialog>
  );
}
