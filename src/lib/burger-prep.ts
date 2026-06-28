import type { Burger } from './types';

export type PrepIcon = 'bun' | 'patty' | 'topping';

export interface PrepItem {
  /** Stable key used to track the checklist state within a burger. */
  key: string;
  label: string;
  quantity: number;
  icon: PrepIcon;
}

/**
 * The ordered list of checklist lines for a single burger: the bun, the patty,
 * then each topping. One line per ingredient regardless of quantity (you prep a
 * line at a time); the quantity is shown alongside the label.
 */
export function getPrepItems(burger: Burger): PrepItem[] {
  return [
    { key: 'bun', label: burger.bun.name, quantity: 1, icon: 'bun' },
    { key: 'patty', label: burger.patty.name, quantity: burger.patty.quantity, icon: 'patty' },
    ...burger.toppings.map((t) => ({
      key: `topping:${t.id}`,
      label: t.name,
      quantity: t.quantity,
      icon: 'topping' as const,
    })),
  ];
}

/** How many of a burger's checklist lines have been prepared. */
export function preparedCount(burger: Burger, prepared: string[] | undefined): number {
  const done = new Set(prepared ?? []);
  return getPrepItems(burger).filter((i) => done.has(i.key)).length;
}

/** A burger is complete (ready to deliver) once every line is checked off. */
export function isBurgerComplete(burger: Burger, prepared: string[] | undefined): boolean {
  const items = getPrepItems(burger);
  return items.length > 0 && preparedCount(burger, prepared) === items.length;
}

export interface IngredientTally {
  name: string;
  total: number;
}

export interface PrepSummary {
  buns: IngredientTally[];
  patties: IngredientTally[];
  toppings: IngredientTally[];
  totalItems: number;
}

/**
 * Aggregate every ingredient across all burgers in the order, summed by name and
 * respecting quantities, so the kitchen can read off how much to prepare in total.
 */
export function getPrepSummary(burgers: Burger[]): PrepSummary {
  const buns = new Map<string, number>();
  const patties = new Map<string, number>();
  const toppings = new Map<string, number>();

  const add = (map: Map<string, number>, name: string, qty: number) =>
    map.set(name, (map.get(name) ?? 0) + qty);

  for (const burger of burgers) {
    add(buns, burger.bun.name, 1);
    add(patties, burger.patty.name, burger.patty.quantity);
    for (const t of burger.toppings) add(toppings, t.name, t.quantity);
  }

  const toTally = (map: Map<string, number>): IngredientTally[] =>
    Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  const lists = { buns: toTally(buns), patties: toTally(patties), toppings: toTally(toppings) };
  const totalItems = [...lists.buns, ...lists.patties, ...lists.toppings].reduce(
    (sum, t) => sum + t.total,
    0
  );

  return { ...lists, totalItems };
}
