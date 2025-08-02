// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/app/api/events/lib/supabase';

// Define the tier hierarchy
const TIER_HIERARCHY = ['free', 'silver', 'gold', 'platinum'] as const;
type Tier = typeof TIER_HIERARCHY[number];

export const dynamic = 'force-dynamic';

// Helper function to get allowed tiers for a user
function getAllowedTiers(userTier: Tier): Tier[] {
  const userTierIndex = TIER_HIERARCHY.indexOf(userTier);
  return TIER_HIERARCHY.slice(0, userTierIndex + 1);
}

export async function GET() {
  try {
    console.log('Fetching events...');
    const session = await auth();
    const userId = session.userId;
    
    if (!userId) {
      console.log("User not found");
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the user's tier from Clerk's private metadata
    const user = await currentUser();
    const userTier = user?.privateMetadata?.tier as Tier || 'free';
    
    if (!TIER_HIERARCHY.includes(userTier)) {
      console.error('Invalid tier in user metadata');
      return new NextResponse('Invalid user tier configuration', { status: 500 });
    }
    const allowedTiers = getAllowedTiers(userTier);

    // 2. Fetch only events that match the user's tier or below
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .in('tier', allowedTiers)
      .order('event_date', { ascending: true });

    if (eventsError) {
      console.error('[SUPABASE_ERROR]', eventsError);
      return new NextResponse('Failed to fetch events', { status: 500 });
    }

    console.log(events) ; 

    return NextResponse.json(events);
  } catch (error) {
    console.error('[EVENTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
