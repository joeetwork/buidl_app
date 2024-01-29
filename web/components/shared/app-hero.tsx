'use client';

import { ReactNode } from 'react';

interface AppHeroProps {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}

export function AppHero({ children, title, subtitle }: AppHeroProps) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
