"use client";

import type { Burger } from '@/lib/types';
import React, { useEffect, useMemo, useState } from 'react';
import BurgerCard from './BurgerCard';
import BurgerIcon from './BurgerIcon';
import PattyIcon from './PattyIcon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ListChecks, RotateCcw, PlusCircle, ClipboardList, Wheat, Carrot } from 'lucide-react';
import { getPrepSummary, isBurgerComplete, type IngredientTally } from '@/lib/burger-prep';

interface BurgerListProps {
  burgers: Burger[];
  removeBurger: (burgerId: string) => void;
  onStartNewOrder: () => void;
  onAddAnotherBurger: () => void;
}

const PREP_STORAGE_KEY = 'burgerPrepProgress';

const TallyGroup: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: IngredientTally[];
}> = ({ title, icon, items }) => {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item.name} variant="secondary" className="px-3 py-1 text-sm font-normal">
            {item.name}
            <span className="ml-1.5 font-semibold tabular-nums">&times;{item.total}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

const BurgerList: React.FC<BurgerListProps> = ({ burgers, removeBurger, onStartNewOrder, onAddAnotherBurger }) => {
  // Per-burger checklist state: burgerId -> array of checked item keys.
  // Persisted to localStorage so prep progress survives a reload mid-service.
  const [prepared, setPrepared] = useState<Record<string, string[]>>({});

  // Hydrate from localStorage on mount (client only, avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREP_STORAGE_KEY);
      if (raw) setPrepared(JSON.parse(raw));
    } catch {
      /* corrupt / unavailable storage — start fresh */
    }
  }, []);

  // Persist whenever progress changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(PREP_STORAGE_KEY, JSON.stringify(prepared));
    } catch {
      /* quota / private mode — ignore */
    }
  }, [prepared]);

  // Drop progress for burgers no longer in the order (e.g. delivered).
  useEffect(() => {
    const ids = new Set(burgers.map((b) => b.id));
    setPrepared((prev) => {
      const keys = Object.keys(prev);
      if (keys.every((k) => ids.has(k))) return prev; // nothing stale — avoid re-render loop
      const next: Record<string, string[]> = {};
      for (const k of keys) if (ids.has(k)) next[k] = prev[k];
      return next;
    });
  }, [burgers]);

  const togglePrepared = (burgerId: string, itemKey: string) => {
    setPrepared((prev) => {
      const current = prev[burgerId] ?? [];
      const next = current.includes(itemKey)
        ? current.filter((k) => k !== itemKey)
        : [...current, itemKey];
      return { ...prev, [burgerId]: next };
    });
  };

  const summary = useMemo(() => getPrepSummary(burgers), [burgers]);
  const readyCount = useMemo(
    () => burgers.filter((b) => isBurgerComplete(b, prepared[b.id])).length,
    [burgers, prepared]
  );

  return (
    <Card className="shadow-xl flex flex-col">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ListChecks className="h-6 w-6 text-primary" />
            Current Burger Orders
          </CardTitle>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <Button variant="outline" onClick={onAddAnotherBurger} className="h-11 sm:h-10">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Burger
            </Button>
            <Button variant="default" onClick={onStartNewOrder} className="h-11 sm:h-10">
              <RotateCcw className="mr-2 h-4 w-4" /> New Order
            </Button>
          </div>
        </div>
        <CardDescription>
          {burgers.length > 0
            ? "All the delicious burgers in the current order."
            : "This order is currently empty. Add some burgers or start a new order."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {burgers.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-muted/50">
              <BurgerIcon className="h-14 w-14 text-primary/70" />
            </div>
            <p className="text-muted-foreground text-lg">No burgers in this order yet.</p>
            <p className="text-sm text-muted-foreground">Tap &ldquo;Add Burger&rdquo; or &ldquo;New Order&rdquo; above to begin.</p>
          </div>
        ) : (
          <>
            {/* Total ingredient counter — what to prep across the whole order. */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Prep Summary
                </h3>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {summary.totalItems} item{summary.totalItems === 1 ? '' : 's'} total
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <TallyGroup title="Buns" icon={<Wheat className="h-4 w-4" />} items={summary.buns} />
                <TallyGroup title="Patties" icon={<PattyIcon className="h-4 w-4" />} items={summary.patties} />
                <TallyGroup title="Toppings" icon={<Carrot className="h-4 w-4" />} items={summary.toppings} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {burgers.map((burger) => (
                <BurgerCard
                  key={burger.id}
                  burger={burger}
                  prepared={prepared[burger.id] ?? []}
                  onTogglePrepared={togglePrepared}
                  onRemove={removeBurger}
                />
              ))}
            </div>
          </>
        )}
      </CardContent>
      {burgers.length > 0 && (
        <CardFooter className="pt-4">
          <p className="text-sm text-muted-foreground">
            Total burgers in this order: {burgers.length}
            <span className="mx-2">&middot;</span>
            Ready to deliver: <span className="font-medium text-foreground">{readyCount}</span>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default BurgerList;
