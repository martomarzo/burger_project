"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number; // 1-based
  onStepClick?: (step: number) => void;
}

const STEPS = ['Ingredients', 'Create', 'Summary'];

const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <nav aria-label="Progress" className="mb-6">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((label, i) => {
          const step = i + 1;
          const isDone = step < currentStep;
          const isCurrent = step === currentStep;
          const canNavigate = !!onStepClick && step <= currentStep;
          return (
            <li key={label} className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                disabled={!canNavigate}
                onClick={() => canNavigate && onStepClick?.(step)}
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-full px-1 py-1 transition-colors',
                  canNavigate ? 'cursor-pointer' : 'cursor-default'
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                    isCurrent && 'border-primary bg-primary text-primary-foreground',
                    isDone && 'border-primary bg-primary/15 text-primary',
                    !isCurrent && !isDone && 'border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {isDone ? <Check className="h-5 w-5" /> : step}
                </span>
                <span
                  className={cn(
                    'hidden text-sm font-medium sm:inline',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {label}
                </span>
              </button>
              {step < STEPS.length && (
                <span
                  className={cn(
                    'h-0.5 w-6 sm:w-10 rounded-full transition-colors',
                    isDone ? 'bg-primary' : 'bg-muted-foreground/25'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Stepper;
