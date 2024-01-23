'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
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
    if (onClose) {
      onClose();
    }
    setModalOpen(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const modalElement = modalRef.current;
    if (!modalElement) {
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
      className="bg-gray-500 !m-auto rounded-md backdrop:bg-gray-900 backdrop:bg-opacity-50"
    >
      <div>
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <form method="dialog">
            {children}
            <button className="btn" onClick={handleCloseModal}>
              Close
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
