import type { Burger, Ingredient } from './types';

/**
 * How many units of each ingredient id are consumed by the burgers already in
 * the order: one bun per burger, plus patty/topping quantities. The ids on a
 * burger's bun/patty/toppings are the originating Ingredient ids.
 */
export function getConsumedCounts(burgers: Burger[]): Record<string, number> {
  const counts: Record<string, number> = {};
  const add = (id: string, n: number) => {
    counts[id] = (counts[id] ?? 0) + n;
  };
  for (const b of burgers) {
    add(b.bun.id, 1);
    add(b.patty.id, b.patty.quantity);
    for (const t of b.toppings) add(t.id, t.quantity);
  }
  return counts;
}

/** An ingredient with no `amount` set is untracked / unlimited. */
export function isUnlimited(ingredient: Ingredient): boolean {
  return ingredient.amount == null;
}

/**
 * Units still available for an ingredient given what the committed burgers have
 * already consumed. Returns `Infinity` for untracked ingredients, and never less
 * than 0 (in case stock was lowered below what's already used).
 */
export function remainingFor(
  ingredient: Ingredient,
  consumed: Record<string, number>
): number {
  if (ingredient.amount == null) return Infinity;
  return Math.max(0, ingredient.amount - (consumed[ingredient.id] ?? 0));
}
