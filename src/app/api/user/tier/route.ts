// app/api/user-tier/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the auth object
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Import the Clerk client
    const { createClerkClient } = await import('@clerk/backend');
    
    // Initialize the Clerk client with the secret key
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY
    });
    
    // Get the user with private metadata
    const user = await clerk.users.getUser(userId);
    
    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    
    // Access the private metadata with type safety
    const tier = (user.privateMetadata?.tier as string) || 'free';
    
    // Validate the tier value
    const validTiers = ['free', 'silver', 'gold', 'platinum'] as const;
    const validTier = validTiers.includes(tier as any) ? tier as typeof validTiers[number] : 'free';
    
    return NextResponse.json({ tier: validTier });
  } catch (error) {
    console.error("[USER_TIER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
