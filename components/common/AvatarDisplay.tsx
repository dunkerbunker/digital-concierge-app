// components/common/AvatarDisplay.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state
import { cn } from '@/lib/utils'; // Utility for merging class names (from Shadcn setup)

interface AvatarDisplayProps {
  className?: string; // Allow passing custom classes for sizing/styling
}

export function AvatarDisplay({ className }: AvatarDisplayProps) {
  const { user, isLoaded, isSignedIn } = useUser();

  // Loading state
  if (!isLoaded) {
    return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
  }

  // Signed-out or user data unavailable state
  if (!isSignedIn || !user) {
    // Render a default placeholder or nothing
    return (
      <Avatar className={cn("h-10 w-10", className)}>
        {/* You might want a generic icon or initials here */}
        <AvatarFallback>??</AvatarFallback>
      </Avatar>
    );
  }

  // Calculate fallback initials (handle null/undefined names)
  const getInitials = (firstName?: string | null, lastName?: string | null): string => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    if (firstInitial && lastInitial) {
      return `${firstInitial}${lastInitial}`;
    }
    if (firstInitial) {
      return firstInitial;
    }
    // Fallback further if no names are available (e.g., use first two letters of username/email)
    const fallbackName = user.username || user.emailAddresses[0]?.emailAddress || '??';
    return fallbackName.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user.firstName, user.lastName);

  // Signed-in state: Display the user's avatar
  return (
    <Avatar className={cn("h-10 w-10", className)}> {/* Default size h-10 w-10, allow override */}
      <AvatarImage
        src={user.imageUrl ?? undefined} // Use Clerk's image URL
        alt={user.fullName ?? 'User avatar'} // Use full name if available for alt text
      />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

export default AvatarDisplay; // Ensure default export if used as such