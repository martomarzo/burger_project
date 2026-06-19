"use client";

import type { Ingredient, Burger } from '@/lib/types';
import React, { useState } from 'react';
import useSyncedState from '@/hooks/useSyncedState';
import AppHeader from '@/components/BurgerBuilder/AppHeader';
import IngredientManager from '@/components/BurgerBuilder/ToppingManager';
import BurgerCreator from '@/components/BurgerBuilder/BurgerCreator';
import BurgerList from '@/components/BurgerBuilder/BurgerList';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';

export default function BurgerBuilderPage() {
  const [availableIngredients, setAvailableIngredients] = useSyncedState<Ingredient[]>('burgerIngredients', [], 'ingredients');
  const [burgers, setBurgers] = useSyncedState<Burger[]>('createdBurgers', [], 'burgers');
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1); // 1: Ingredients, 2: Create, 3: Summary

  const addBurger = (burger: Burger) => {
    setBurgers(prevBurgers => [...prevBurgers, burger]);
  };

  const removeBurger = (burgerId: string) => {
    const burgerToRemove = burgers.find(b => b.id === burgerId);
    setBurgers(prevBurgers => prevBurgers.filter(b => b.id !== burgerId));
    if (burgerToRemove) {
      toast({
        title: 'Order Delivered!',
        description: `The order for ${burgerToRemove.personName} has been marked as delivered.`,
      });
    }
  };

  const handleNextFromIngredients = () => {
    const hasBun = availableIngredients.some(i => i.category === 'bun');
    const hasPatty = availableIngredients.some(i => i.category === 'patty');
    const hasTopping = availableIngredients.some(i => i.category === 'topping');

    if (!hasBun || !hasPatty || !hasTopping) {
      toast({
        title: "Missing Ingredient Types",
        description: "Please add at least one bun, one patty, and one topping to proceed.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleBackToIngredients = () => {
    setCurrentStep(1);
  };

  const handleBackToCreator = () => {
    setCurrentStep(2);
  };

  const handleOrderReady = () => {
     if (burgers.length === 0) {
      toast({
        title: "Empty Order",
        description: "You haven't added any burgers to this order yet. Proceeding to summary.",
        variant: "default",
      });
    } else {
      toast({
        title: "Order Finalized",
        description: "Moving to the order summary.",
      });
    }
    setCurrentStep(3);
  };

  const handleStartNewOrder = () => {
    setBurgers([]);
    setCurrentStep(1);
    toast({
      title: "New Order Started",
      description: "Previous order cleared. Let's build some new burgers!",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full">
          {currentStep === 1 && (
            <div className="max-w-4xl mx-auto">
              <IngredientManager 
                availableIngredients={availableIngredients} 
                setAvailableIngredients={setAvailableIngredients} 
                onNext={handleNextFromIngredients}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-4xl mx-auto">
              <BurgerCreator 
                availableIngredients={availableIngredients} 
                addBurger={addBurger} 
                onGoBack={handleBackToIngredients} 
                onOrderReady={handleOrderReady}
              />
            </div>
          )}

          {currentStep === 3 && (
            <BurgerList 
              burgers={burgers} 
              removeBurger={removeBurger} 
              onStartNewOrder={handleStartNewOrder}
              onAddAnotherBurger={handleBackToCreator}
            />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
