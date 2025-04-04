// components/concierge/CornerNavItem.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface CornerNavItemProps {
  href: string;
  icon: LucideIcon; // Expecting a Lucide icon component
  label: string;
  position: Position;
  className?: string;
}

const getPositionClasses = (position: Position): string => {
  const padding = 'p-4 md:p-6'; // Adjust padding as needed
  switch (position) {
    case 'top-left':
      return `absolute top-0 left-0 ${padding}`;
    case 'top-right':
      return `absolute top-0 right-0 ${padding}`;
    case 'bottom-left':
      return `absolute bottom-0 left-0 ${padding}`;
    case 'bottom-right':
      return `absolute bottom-0 right-0 ${padding}`;
    default:
      return '';
  }
};

const CornerNavItem: React.FC<CornerNavItemProps> = ({
  href,
  icon: Icon, // Rename prop for clarity
  label,
  position,
  className,
}) => {
  const positionClasses = getPositionClasses(position);

  return (
    <Link href={href} passHref legacyBehavior>
      <a className={cn(positionClasses, className)}>
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-auto p-2 rounded-lg hover:bg-accent/50 transition-colors"
          aria-label={label}
        >
          <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mb-1 text-primary" />
          <span className="text-xs sm:text-sm text-center text-primary font-medium">
            {label}
          </span>
        </Button>
      </a>
    </Link>
  );
};

export default CornerNavItem;