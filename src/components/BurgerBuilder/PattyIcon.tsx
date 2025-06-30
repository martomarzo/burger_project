"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

const PattyIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="hsl(var(--background))"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5', className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M7 10q2.5-1.5 10 0" fill="none" />
      <path d="M7 14q2.5 1.5 10 0" fill="none" />
    </svg>
  )
);
PattyIcon.displayName = 'PattyIcon';

export default PattyIcon;
