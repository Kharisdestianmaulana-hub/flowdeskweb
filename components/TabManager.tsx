'use client';

import { useEffect, useRef } from 'react';

interface TabManagerProps {
  currentLang: string;
}

export default function TabManager({ currentLang }: TabManagerProps) {
  const originalTitle = useRef<string | null>(null);

  useEffect(() => {
    // Save the original title when the component mounts
    originalTitle.current = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is inactive
        document.title = currentLang === 'id' 
          ? 'Menunggu Anda kembali... 👀' 
          : 'Waiting for you... 👀';
      } else {
        // Tab is active again
        if (originalTitle.current) {
          document.title = originalTitle.current;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentLang]);

  return null;
}
