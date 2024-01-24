'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  allowOutsideClick?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  title,
  allowOutsideClick,
  onClose,
  onSubmit,
  children,
}: ModalProps) {
  const [isModalOpen, setModalOpen] = useState(isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (isModalOpen) {
        modalElement.showModal();
      } else {
        modalElement.close();
      }
    }
  }, [isModalOpen]);

  const handleCloseModal = () => {
    onClose();
    setModalOpen(false);
  };

  const handleSubmitModal = () => {
    if (onSubmit) {
      onSubmit();
    }
    onClose();
    setModalOpen(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const modalElement = modalRef.current;
    if (!modalElement || !allowOutsideClick) {
      return;
    }

    const dialogDimensions = modalElement.getBoundingClientRect();

    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      handleCloseModal();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
  };

  return (
    <dialog
      ref={modalRef}
      onClick={handleOutsideClick}
      onKeyDown={handleKeyDown}
      className="bg-gray-500 !m-auto w-3/6 rounded-md backdrop:bg-gray-900 backdrop:bg-opacity-50"
    >
      <div className="flex flex-col">
        <h3 className="font-bold text-lg">{title}</h3>
          <form method="dialog" className='flex flex-col pt-6 pb-3 items-center'>{children}</form>
        </div>
        <div className='flex justify-end gap-2'>
          {onSubmit ? (
            <button className="btn" onClick={handleSubmitModal}>
              Submit
            </button>
          ) : null}
          <button className="btn" onClick={handleCloseModal}>
            Close
          </button>
        </div>
    </dialog>
  );
}
