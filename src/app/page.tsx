"use client";

import type { Topping, Burger } from '@/lib/types';
import React from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import AppHeader from '@/components/BurgerBuilder/AppHeader';
import ToppingManager from '@/components/BurgerBuilder/ToppingManager';
import BurgerCreator from '@/components/BurgerBuilder/BurgerCreator';
import BurgerList from '@/components/BurgerBuilder/BurgerList';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';

export default function BurgerBuilderPage() {
  const [availableToppings, setAvailableToppings] = useLocalStorage<Topping[]>('burgerToppings', []);
  const [burgers, setBurgers] = useLocalStorage<Burger[]>('createdBurgers', []);
  const { toast } = useToast();

  const addBurger = (burger: Burger) => {
    setBurgers(prevBurgers => [...prevBurgers, burger]);
  };

  const removeBurger = (burgerId: string) => {
    const burgerToRemove = burgers.find(b => b.id === burgerId);
    setBurgers(prevBurgers => prevBurgers.filter(b => b.id !== burgerId));
    if (burgerToRemove) {
      toast({
        title: 'Burger Removed',
        description: `The order for ${burgerToRemove.personName} has been removed.`,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Column: Management */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <ToppingManager availableToppings={availableToppings} setAvailableToppings={setAvailableToppings} />
            <BurgerCreator availableToppings={availableToppings} addBurger={addBurger} />
          </div>

          {/* Right Column: Burger List */}
          <div className="lg:col-span-3">
            <BurgerList burgers={burgers} removeBurger={removeBurger} />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
