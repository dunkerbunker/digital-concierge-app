// components/concierge/RiveAvatar.tsx
'use client';

import React from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { cn } from '@/lib/utils'; // Assuming your path alias is set up

interface RiveAvatarProps {
  src: string;
  stateMachineName?: string; // Optional: If you want to control specific animations later
  className?: string;
}

const RiveAvatar: React.FC<RiveAvatarProps> = ({
  src = '/avatars/character_test.riv', // Default to the downloaded avatar
  stateMachineName,
  className,
}) => {
  const { RiveComponent } = useRive({
    src: src,
    stateMachines: stateMachineName ? [stateMachineName] : undefined,
    layout: new Layout({
      fit: Fit.Contain, // Adjust fit as needed (Contain, Cover, Fill, etc.)
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  // Base classes + responsive sizing
  const baseClasses = 'w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80';

  return (
    <div className={cn(baseClasses, className)}>
      <RiveComponent />
    </div>
  );
};

export default RiveAvatar;