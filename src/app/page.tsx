"use client";

import type { Topping, Burger } from '@/lib/types';
import React, { useState } from 'react';
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
  const [currentStep, setCurrentStep] = useState(1); // 1: Toppings, 2: Create, 3: Summary

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

  const handleNextFromToppings = () => {
    if (availableToppings.length === 0) {
      toast({
        title: "No Toppings Available",
        description: "Please add at least one topping before proceeding to create burgers.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleBackToToppings = () => {
    setCurrentStep(1);
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
    setAvailableToppings([]); // Clear toppings for a completely new order session
    setCurrentStep(1);
    toast({
      title: "New Order Started",
      description: "Previous order details cleared. Let's build some new burgers!",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full">
          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto">
              <ToppingManager 
                availableToppings={availableToppings} 
                setAvailableToppings={setAvailableToppings} 
                onNext={handleNextFromToppings}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
              <BurgerCreator 
                availableToppings={availableToppings} 
                addBurger={addBurger} 
                onGoBack={handleBackToToppings} 
                onOrderReady={handleOrderReady}
              />
            </div>
          )}

          {currentStep === 3 && (
            <BurgerList 
              burgers={burgers} 
              removeBurger={removeBurger} 
              onStartNewOrder={handleStartNewOrder}
            />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
