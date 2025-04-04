// components/layout/GuestHeader.tsx
'use client'; // Needs to be a client component to use Clerk hooks/components

import React from 'react';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button
import Logo from '@/components/common/Logo'; // Assuming you have a Logo component

const GuestHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Left side: Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo /> {/* Your Logo Component */}
          <span className="font-bold sm:inline-block">Concierge</span>
        </Link>

        {/* Right side: Auth Buttons */}
        <nav className="flex items-center space-x-2">
          <SignedIn>
            {/* Mount the UserButton component */}
            {/* You can customize appearance and afterSignOutUrl */}
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
          <SignedOut>
            {/* Signed out users get sign in button */}
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign In</Link>
            </Button>
             <Button asChild >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
};

export default GuestHeader;