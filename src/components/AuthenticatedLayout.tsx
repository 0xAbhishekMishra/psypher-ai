'use client';

import { useUser } from '@clerk/nextjs';
import { Navigation } from './Navigation';
import { useEffect, useState } from 'react';

type Tier = 'free' | 'silver' | 'gold' | 'platinum';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();
  const [tier, setTier] = useState<Tier>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserTier = async () => {
      if (!isUserLoaded) return;
      
      try {
        const response = await fetch('/api/user/tier');

        if (response.ok) {
          const data = await response.json();
          console.log("User tier:", data.tier);
          setTier(data.tier || 'free');
        } else {
          console.error('Failed to fetch user tier');
          setTier('free');
        }
      } catch (error) {
        console.error('Error fetching user tier:', error);
        setTier('free');
      } finally {
        setIsLoading(false);
      }
    };

    if (isSignedIn) {
      fetchUserTier();
    } else {
      setIsLoading(false);
    }
  }, [isUserLoaded, isSignedIn]);

  if (!isUserLoaded || isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <Navigation userTier={tier} />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
