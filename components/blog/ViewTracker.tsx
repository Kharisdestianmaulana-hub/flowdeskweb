'use client';

import { useEffect } from 'react';

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // We want to run this once when the component mounts
    const hasViewed = localStorage.getItem(`viewed_${slug}`);
    
    if (!hasViewed) {
      // If haven't viewed, send a request to increment view count
      fetch(`/api/posts/${slug}/view`, {
        method: 'POST',
      })
      .then(res => {
        if (res.ok) {
          // If successful, mark as viewed in local storage
          localStorage.setItem(`viewed_${slug}`, 'true');
        }
      })
      .catch(err => {
        console.error('Failed to track view', err);
      });
    }
  }, [slug]);

  // This component doesn't render anything visible
  return null;
}
