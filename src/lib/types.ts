export interface Ingredient {
  id: string;
  name: string;
  category: 'bun' | 'patty' | 'topping';
  /** Units in stock. Omitted/undefined means unlimited (untracked). */
  amount?: number;
}

export interface BurgerTopping {
  id: string;
  name: string;
  quantity: number;
}

export interface Burger {
  id: string;
  personName: string;
  bun: Ingredient;
  patty: BurgerTopping;
  toppings: BurgerTopping[];
}
