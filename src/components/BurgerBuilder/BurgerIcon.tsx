"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

const BurgerIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-6 w-6', className)}
      {...props}
    >
      <path d="M21 11H3" />
      <path d="M12 11C12 7.66667 10 4 6 4" />
      <path d="M12 11C12 7.66667 14 4 18 4" />
      <path d="M21 16H3" />
      <path d="M12 16C12 19.3333 10 22 6 22" />
      <path d="M12 16C12 19.3333 14 22 18 22" />
    </svg>
  )
);
BurgerIcon.displayName = 'BurgerIcon';

export default BurgerIcon;
