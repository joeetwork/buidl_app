'use client';

import * as React from 'react';
import { ReactNode, Suspense } from 'react';

import { AccountChecker } from '../account/account-ui';
import { ClusterChecker } from '../cluster/cluster-ui';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function UiLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>
      <div className="flex-grow mx-4 lg:mx-auto">
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </div>
      <Footer />
    </div>
  );
}
