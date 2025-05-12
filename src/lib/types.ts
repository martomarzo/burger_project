export interface Topping {
  id: string;
  name: string;
}

export interface Burger {
  id: string;
  personName: string;
  toppings: Topping[];
}
