"use client";

import type { Topping, Burger, BurgerTopping } from '@/lib/types';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sandwich, UserCircle, ArrowLeft, PackageCheck, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BurgerCreatorProps {
  availableToppings: Topping[];
  addBurger: (burger: Burger) => void;
  onGoBack: () => void;
  onOrderReady: () => void;
}

const BurgerCreator: React.FC<BurgerCreatorProps> = ({ availableToppings, addBurger, onGoBack, onOrderReady }) => {
  const [personName, setPersonName] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleQuantityChange = (toppingId: string, change: 1 | -1) => {
    setQuantities(prev => {
      const currentQuantity = prev[toppingId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);

      const newQuantities = { ...prev };
      if (newQuantity === 0) {
        delete newQuantities[toppingId];
      } else {
        newQuantities[toppingId] = newQuantity;
      }
      return newQuantities;
    });
  };
  
  const handleCreateAndAddAnotherBurger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) {
      toast({
        title: 'Missing Name',
        description: "Please enter a name for the person this burger is for.",
        variant: 'destructive',
      });
      return;
    }

    const toppingsForBurger: BurgerTopping[] = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([toppingId, quantity]) => {
        const topping = availableToppings.find(t => t.id === toppingId)!;
        return { ...topping, quantity };
      });
    
    if (toppingsForBurger.length === 0) {
      toast({
        title: 'No Toppings Selected',
        description: 'A burger must have at least one topping. Please add some.',
        variant: 'destructive',
      });
      return;
    }

    const newBurger: Burger = {
      id: Date.now().toString(),
      personName: personName.trim(),
      toppings: toppingsForBurger,
    };

    addBurger(newBurger);
    
    toast({
      title: 'Burger Added!',
      description: `Burger for ${newBurger.personName} added to the order. Add another or finalize order.`,
    });

    // Reset form for next burger
    setPersonName('');
    setQuantities({});
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sandwich className="h-6 w-6 text-primary" />
          Create Burgers
        </CardTitle>
        <CardDescription>Build custom burgers one by one. Add them to the current order.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateAndAddAnotherBurger} className="space-y-6">
          <div>
            <Label htmlFor="personName" className="flex items-center gap-2 mb-2 font-medium">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              Burger For (Name):
            </Label>
            <Input
              id="personName"
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g., John Doe"
              aria-label="Person's name for the burger"
            />
          </div>

          <div>
            <Label className="block mb-2 font-medium">Select Toppings:</Label>
            {availableToppings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No toppings available. Please go back and add toppings first.</p>
            ) : (
              <ScrollArea className="h-80 rounded-md border p-3 shadow-inner bg-background/50">
                <div className="space-y-3">
                  {availableToppings.map((topping) => (
                    <div key={topping.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors duration-150">
                      <Label htmlFor={`topping-qty-${topping.id}`} className="text-sm font-normal cursor-pointer">
                        {topping.name}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(topping.id, -1)} aria-label={`Decrease quantity of ${topping.name}`}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span id={`topping-qty-${topping.id}`} className="w-8 text-center font-medium text-lg" aria-live="polite">{quantities[topping.id] || 0}</span>
                        <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(topping.id, 1)} aria-label={`Increase quantity of ${topping.name}`}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3" 
            disabled={availableToppings.length === 0}
          >
            <Sandwich className="mr-2 h-5 w-5" /> Add This Burger to Order
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-6 flex flex-col sm:flex-row justify-between gap-3">
        <Button variant="outline" onClick={onGoBack} className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Toppings
        </Button>
        <Button onClick={onOrderReady} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
          Order Ready <PackageCheck className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BurgerCreator;
