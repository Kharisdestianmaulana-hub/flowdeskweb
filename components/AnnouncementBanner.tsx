'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnnouncementBannerProps {
  latestRelease: any;
  lang: string;
}

export default function AnnouncementBanner({ latestRelease, lang }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      document.documentElement.style.setProperty('--navbar-top', '0px');
    } else {
      document.documentElement.style.setProperty('--navbar-top', '39px');
    }
    
    return () => {
      // Cleanup on unmount just in case
      document.documentElement.style.removeProperty('--navbar-top');
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 w-full bg-[var(--color-primary)] py-2 px-4 pr-12 flex items-center justify-center text-[12px] sm:text-[13px] font-medium text-white z-[110] relative">
      <div className="text-center">
        <span>What's New: {latestRelease?.tag_name || 'Update'} Is Here!!!</span>
        <Link href={`/${lang}/download`} className="ml-1 sm:ml-2 font-semibold text-white underline hover:text-white/80 transition-colors whitespace-nowrap">
          Learn more
        </Link>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
  );
}
