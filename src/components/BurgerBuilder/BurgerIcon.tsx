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
      <path d="M12 4c-4.42 0-8 2.69-8 6h16c0-3.31-3.58-6-8-6z" />
      <path d="M5 12h14" />
      <path d="M12 20c4.42 0 8-2.69 8-6H4c0 3.31 3.58 6 8 6z" />
    </svg>
  )
);
BurgerIcon.displayName = 'BurgerIcon';

export default BurgerIcon;