'use client';

import * as React from 'react';
import { ReactNode, Suspense } from 'react';

import { Toaster } from 'react-hot-toast';
import { Navbar } from './navbar';
import { Footer } from './footer';
import DashboardNav from './dashboard-nav';
import { usePathname } from 'next/navigation';
import { SUBPAGES } from '@/constants';

export function UiLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      <Navbar />
      {SUBPAGES.map((page, i) => {
        return pathname.startsWith(page.path) && <DashboardNav key={i} />;
      })}
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
