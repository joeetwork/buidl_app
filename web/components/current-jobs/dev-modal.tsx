import React from 'react';
import { useAccounts } from '@/hooks/get-accounts';
import { AppModal } from '../shared/app-modal';

interface HiringModalProps {
  show: boolean;
  hideModal: () => void;
}

export default function DevModal({ show, hideModal }: HiringModalProps) {
  const { uploadDevHistory } = useAccounts();

  return (
    <AppModal title={`Upload History`} show={show} hide={hideModal}>
      <div className="flex flex-col">
        {uploadDevHistory.data?.map((work) => {
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
