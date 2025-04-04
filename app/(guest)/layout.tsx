// Example: app/(guest)/layout.tsx
import GuestHeader from "@/components/layout/GuestHeader"; // Adjust import path
import React from "react";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <GuestHeader /> {/* Include the header */}
      <main className="flex-1">{children}</main>
      {/* You could add a footer here */}
    </div>
  );
}