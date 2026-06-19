"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { UserCircle } from 'lucide-react';

export interface PreviewTopping {
  id: string;
  name: string;
  quantity: number;
}

interface BurgerPreviewProps {
  personName?: string;
  bunName?: string | null;
  pattyName?: string | null;
  pattyQuantity?: number;
  toppings: PreviewTopping[];
  className?: string;
}

// Playful color map so the stack reads like a real burger.
function toppingColor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('cheese')) return '#F6C744';
  if (n.includes('onion')) return '#E9D5C0';
  if (n.includes('tomato')) return '#E05A43';
  if (n.includes('bacon')) return '#B5462F';
  if (n.includes('pepperoni') || n.includes('ham')) return '#C65B5B';
  if (n.includes('lettuce')) return '#7FB852';
  if (n.includes('pickle') || n.includes('cucumber')) return '#8FBF54';
  if (n.includes('avocado') || n.includes('guac')) return '#86A94B';
  if (n.includes('mushroom')) return '#A1887F';
  if (n.includes('egg')) return '#FFD970';
  if (n.includes('sauce') || n.includes('ketchup') || n.includes('mayo')) return '#E8A85C';
  return '#D7A86E';
}

const Layer: React.FC<{
  color: string;
  label: string;
  badge?: string;
  className?: string;
  textDark?: boolean;
}> = ({ color, label, badge, className, textDark = true }) => (
  <div
    className={cn(
      'relative flex h-7 items-center justify-center rounded-md px-3 text-xs font-semibold shadow-sm ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-300',
      className
    )}
    style={{ backgroundColor: color, color: textDark ? '#3a2a1a' : '#fff' }}
  >
    <span className="truncate">{label}</span>
    {badge && (
      <span className="absolute right-2 rounded-full bg-black/15 px-1.5 text-[10px] leading-4">
        {badge}
      </span>
    )}
  </div>
);

const BurgerPreview: React.FC<BurgerPreviewProps> = ({
  personName,
  bunName,
  pattyName,
  pattyQuantity = 1,
  toppings,
  className,
}) => {
  const hasBase = !!bunName && !!pattyName;

  return (
    <div className={cn('rounded-xl border bg-card p-4 shadow-inner', className)}>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <UserCircle className="h-4 w-4" />
        <span className="truncate text-foreground">
          {personName?.trim() ? `${personName.trim()}'s burger` : 'Live preview'}
        </span>
      </div>

      {!hasBase ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Pick a bun and a patty to watch the burger come together.
        </p>
      ) : (
        <div className="mx-auto flex w-full max-w-[260px] flex-col gap-1.5">
          {/* Top bun */}
          <div
            className="h-8 rounded-t-[999px] rounded-b-md shadow-sm ring-1 ring-black/5"
            style={{ backgroundColor: '#E8A95C' }}
            aria-label={`Top bun: ${bunName}`}
          />
          {/* Toppings (visual top-down) */}
          {toppings.map((t) => (
            <Layer
              key={t.id}
              color={toppingColor(t.name)}
              label={t.name}
              badge={t.quantity > 1 ? `x${t.quantity}` : undefined}
            />
          ))}
          {/* Patties */}
          {Array.from({ length: Math.max(1, pattyQuantity) }).map((_, i) => (
            <Layer
              key={`patty-${i}`}
              color="#6B4226"
              textDark={false}
              label={pattyName ?? 'Patty'}
              badge={i === 0 && pattyQuantity > 1 ? `x${pattyQuantity}` : undefined}
            />
          ))}
          {/* Bottom bun */}
          <div
            className="h-5 rounded-b-xl rounded-t-md shadow-sm ring-1 ring-black/5"
            style={{ backgroundColor: '#E2A158' }}
            aria-label={`Bottom bun: ${bunName}`}
          />
        </div>
      )}
    </div>
  );
};

export default BurgerPreview;
