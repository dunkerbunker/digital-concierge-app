// components/layout/GuestHeader.tsx
'use client'; // Required for Clerk hooks and components

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
// import Logo from '../common/Logo'; // Adjust path if necessary
import MobileNav from './MobileNav'; // Adjust path if necessary
// import NotificationBell from '../features/notifications/NotificationBell'; // Uncomment if you have this
import { Button } from '@/components/ui/button'; // Assuming use of Shadcn/UI Button for styling SignIn

const GuestHeader = () => {
  // Define navigation links for the guest area
  const navLinks = [
    { href: '/guest/home', label: 'Home' },
    { href: '/guest/bookings', label: 'Bookings' },
    { href: '/guest/itinerary', label: 'Itinerary' },
    { href: '/guest/profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/guest/home" aria-label="Go to homepage">
          {/* <Logo /> */}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Auth Controls & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Clerk Auth Controls */}
          <SignedIn>
            {/* Appears when user is signed in */}
            {/* <NotificationBell /> */} {/* Uncomment if using */}
            <div className="ml-auto flex items-center gap-4">
               {/* Optional: Add NotificationBell here if only for logged-in users */}
              <UserButton
                afterSignOutUrl="/" // Redirect to landing page after sign out
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8", // Adjust size if needed
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            {/* Appears when user is signed out */}
            <SignInButton mode="modal">
              {/* Using Shadcn UI Button as trigger */}
              <Button variant="default" size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>

          {/* Mobile Navigation Trigger (only shows on smaller screens) */}
          <div className="md:hidden">
             {/* Pass navLinks and potentially auth state to MobileNav if needed */}
            <MobileNav navLinks={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default GuestHeader;