'use client';
import React from 'react';
import { AppModal } from '../shared/app-modal';
import { useHistory } from '@/hooks/history';

interface HistoryModalProps {
  role?: string;
  show: boolean;
  hideModal: () => void;
}

export default function HistoryModal({
  role,
  show,
  hideModal,
}: HistoryModalProps) {
  const { uploadHistory } = useHistory({ role });

  return (
    <AppModal title={`Upload History`} show={show} hide={hideModal}>
      <div className="flex flex-col">
        {uploadHistory.data?.map((work) => {
          return (
            <div
              key={work.publicKey.toString()}
              className="card w-80 bg-base-100 shadow-xl m-auto"
            >
              <div className="card-body">
                <h2 className="text-center font-bold">Upload</h2>
                <p>Amount: {work.account.amount.toString()}</p>
                <p className="w-full break-words">
                  About: {work.account.about}
                </p>

                <button
                  className="btn"
                  onClick={() => window.open(work.account.uploadWork)}
                >
                  Work
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppModal>
  );
}
