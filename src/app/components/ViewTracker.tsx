'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  postId: number;
}

export default function ViewTracker({ postId }: ViewTrackerProps) {
  useEffect(() => {
    // Track view when component mounts (user visits the page)
    const trackView = async () => {
      try {
        await fetch('/api/posts/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId }),
        });
      } catch (error) {
        console.warn('Failed to track view:', error);
      }
    };

    trackView();
  }, [postId]);

  // This component doesn't render anything
  return null;
} 