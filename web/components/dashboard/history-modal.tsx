'use client';
import React from 'react';
import { AppModal } from '../shared/app-modal';
import * as anchor from '@coral-xyz/anchor';
import { AnchorEscrow } from '@buidl/anchor';
import { PublicKey } from '@solana/web3.js';

interface HistoryModalProps {
  uploadHistory?: {
    account: anchor.IdlAccounts<AnchorEscrow>['upload'];
    publicKey: PublicKey;
  }[];
  show: boolean;
  hideModal: () => void;
}

export default function HistoryModal({
  uploadHistory,
  show,
  hideModal,
}: HistoryModalProps) {
  return (
    <AppModal title={`Upload History`} show={show} hide={hideModal}>
      <div className="flex flex-col">
        {uploadHistory?.map((work) => {
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
