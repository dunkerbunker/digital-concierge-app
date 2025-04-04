// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI Button
// import Logo from '@/components/common/Logo'; // Adjust path if needed
import { SignInButton, SignUpButton } from '@clerk/nextjs'; // Import Clerk buttons

export default function LandingPage() {
  return (
    // Basic centering and padding using Tailwind
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center space-y-6 max-w-2xl">

        {/* Optional: Display Logo */}
        <div className="flex justify-center mb-4">
          {/* <Logo /> */}
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to the Digital Concierge
        </h1>

        {/* Sub-description */}
        <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
          Your personal assistant for seamless service requests, bookings, and itinerary management. Access everything you need, right at your fingertips.
        </p>

        {/* Call-to-action Buttons */}
        <div className="mt-8 flex justify-center gap-x-4 sm:gap-x-6">
          {/* Clerk Sign-In Button */}
          <SignInButton
            mode="modal" // Open Clerk UI in a modal
            afterSignInUrl="/guest/home" // Redirect here after successful sign-in
            afterSignUpUrl="/guest/home" // Redirect here if user signs up from sign-in modal
          >
            <Button size="lg" variant="default">
              Sign In
            </Button>
          </SignInButton>

          {/* Clerk Sign-Up Button */}
          <SignUpButton
            mode="modal" // Open Clerk UI in a modal
            afterSignUpUrl="/guest/home" // Redirect here after successful sign-up
            afterSignInUrl="/guest/home" // Redirect here if user signs in from sign-up modal
          >
            <Button size="lg" variant="outline">
              Sign Up
            </Button>
          </SignUpButton>
        </div>

      </div>
    </main>
  );
}