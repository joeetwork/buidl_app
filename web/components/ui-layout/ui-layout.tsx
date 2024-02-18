'use client';

import * as React from 'react';
import { ReactNode, Suspense } from 'react';

import { Toaster } from 'react-hot-toast';
import { Navbar } from './navbar';
import { Footer } from './footer';

export function UiLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <main className="flex-grow mx-4">
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
      </main>
      <Footer />
    </div>
  );
}
