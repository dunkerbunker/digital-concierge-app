// components/layout/MobileNav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';
import { Menu as MenuIcon } from 'lucide-react'; // Hamburger icon

// Define the expected props type
interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
}

const MobileNav = ({ navLinks }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden" // Only show trigger on mobile
          aria-label="Open main menu"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left"> {/* Or "right" if preferred */}
        <SheetHeader className="mb-6">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-3">
          {navLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              {/* SheetClose ensures the sheet closes when a link is clicked */}
              <Link
                href={link.href}
                className="text-lg font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)} // Explicitly close on click
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        {/* Auth buttons at the bottom */}
        <SheetFooter className="mt-8 pt-6 border-t">
          <div className="w-full">
            <SignedIn>
               {/* Use SignOutButton for simpler behavior within sheet */}
              <SheetClose asChild>
                 <SignOutButton redirectUrl="/">
                   {/* Button styling for Sign Out */}
                   <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                     Sign Out
                   </Button>
                 </SignOutButton>
              </SheetClose>
            </SignedIn>

            <SignedOut>
              <SheetClose asChild>
                <SignInButton mode="modal">
                  {/* Button styling for Sign In */}
                  <Button variant="default" className="w-full" onClick={() => setIsOpen(false)}>
                    Sign In
                  </Button>
                </SignInButton>
              </SheetClose>
            </SignedOut>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;