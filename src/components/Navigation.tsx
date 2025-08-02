'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

// Map between navigation tiers and event tiers
const TIER_MAPPING = {
  free: 'free',
  silver: 'silver',
  gold: 'gold',
  platinum: 'platinum'
} as const;

type NavTier = keyof typeof TIER_MAPPING;
type EventTier = 'free' | 'silver' | 'gold' | 'platinum';   

const NAV_TIERS = Object.keys(TIER_MAPPING) as NavTier[];

interface NavigationProps {
  userTier: NavTier;
}

export function Navigation({ userTier = 'free' }: NavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTier = searchParams?.get('tier') as NavTier | null;

  // Convert event tier to navigation tier
  const getNavTier = (tier: EventTier): NavTier => {
    return (Object.entries(TIER_MAPPING).find(([_, value]) => value === tier)?.[0] || 'free') as NavTier;
  };

  // Get the index of the user's tier to determine which tiers to show
  const userEventTier = TIER_MAPPING[userTier];
  const userNavTier = getNavTier(userEventTier);
  const userTierIndex = NAV_TIERS.indexOf(userTier);
  const allowedTiers = NAV_TIERS.slice(0, userTierIndex + 1);

  // Get the active tier, defaulting to the user's tier if none selected
  const currentActiveTier = activeTier && allowedTiers.includes(activeTier) 
    ? activeTier 
    : userNavTier;

  const getTierColor = (tier: NavTier) => {
    switch (tier) {
      case 'free': return 'text-green-600 hover:bg-green-50';
      case 'silver': return 'text-gray-600 hover:bg-gray-50';
      case 'gold': return 'text-yellow-600 hover:bg-yellow-50';
      case 'platinum': return 'text-purple-600 hover:bg-purple-50';
      default: return 'text-gray-600 hover:bg-gray-50';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Psypher AI
            </Link>
          </div>

          {/* Middle - Tier Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {allowedTiers.map((tier) => {
              const isActive = tier === currentActiveTier;
              return (
                <Link
                  key={tier}
                  href={`/events?tier=${tier}`}
                  className={`${getTierColor(tier)} ${
                    isActive ? 'border-b-2 border-indigo-500' : ''
                  } inline-flex items-center px-1 pt-1 text-sm font-medium capitalize`}
                >
                  {tier}
                </Link>
              );
            })}
          </div>

          {/* Right side - Auth Buttons */}
          <div className="flex items-center">
            <SignedIn>
              <div className="ml-4 flex items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex space-x-4">
                <SignInButton>
                  <button className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {allowedTiers.map((tier) => (
            <Link
              key={tier}
              href={`/events${tier === 'free' ? '' : `?tier=${tier}`}`}
              className={`${getTierColor(tier as NavTier)} ${
                activeTier === tier ? 'bg-indigo-50 border-indigo-500' : ''
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium capitalize`}
            >
              {tier}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
