export interface Topping {
  id: string;
  name: string;
}

export interface BurgerTopping {
  id: string;
  name: string;
  quantity: number;
}

export interface Burger {
  id: string;
  personName: string;
  toppings: BurgerTopping[];
}
