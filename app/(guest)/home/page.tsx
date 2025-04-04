// app/(guest)/page.tsx
'use client'; // Needed because we're using client components directly

import React from 'react';
import RiveAvatar from '@/components/concierge/RiveAvatar';
import CornerNavItem from '@/components/concierge/CornerNavItem';
import { User, CalendarDays, ListChecks, Settings } from 'lucide-react'; // Import desired icons

export default function GuestHomePage() {
  return (
    // Main container: Full height, flexbox centering, relative for positioning children
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden p-4">

      {/* Centered Rive Avatar */}
      <RiveAvatar
        src="/avatars/character_test.riv" // Ensure this path matches your saved file
        className="mb-8" // Add some margin below the avatar if needed
      />

      {/* Corner Navigation Items */}
      <CornerNavItem
        href="/guest/profile"
        icon={User}
        label="Profile"
        position="top-left"
      />
      <CornerNavItem
        href="/guest/bookings"
        icon={CalendarDays}
        label="Bookings"
        position="top-right"
      />
      <CornerNavItem
        href="/guest/itinerary"
        icon={ListChecks} // Using ListChecks for Itinerary
        label="Itinerary"
        position="bottom-left"
      />
       <CornerNavItem
        href="/guest/settings" // Example: Link to a settings page
        icon={Settings}
        label="Settings"
        position="bottom-right"
      />

      {/* You can add a subtle background element here if desired */}
      {/* Example: <div className="absolute inset-0 bg-gradient-to-br from-background to-blue-50 -z-10"></div> */}

    </div>
  );
}