"use client";

import type { Ingredient, Burger, BurgerTopping } from '@/lib/types';
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sandwich, UserCircle, ArrowLeft, PackageCheck, Plus, Minus, Wheat, Beef, Carrot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BurgerCreatorProps {
  availableIngredients: Ingredient[];
  addBurger: (burger: Burger) => void;
  onGoBack: () => void;
  onOrderReady: () => void;
}

const BurgerCreator: React.FC<BurgerCreatorProps> = ({ availableIngredients, addBurger, onGoBack, onOrderReady }) => {
  const [personName, setPersonName] = useState('');
  const [selectedBunId, setSelectedBunId] = useState<string | null>(null);
  const [selectedPatty, setSelectedPatty] = useState<{id: string, quantity: number} | null>(null);
  const [toppingQuantities, setToppingQuantities] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const { buns, patties, toppings } = useMemo(() => {
    const grouped = availableIngredients.reduce((acc, ingredient) => {
      (acc[ingredient.category] = acc[ingredient.category] || []).push(ingredient);
      return acc;
    }, {} as Record<Ingredient['category'], Ingredient[]>);
    return {
      buns: grouped.bun || [],
      patties: grouped.patty || [],
      toppings: grouped.topping || [],
    };
  }, [availableIngredients]);
  
  const resetForm = () => {
    setPersonName('');
    setSelectedBunId(null);
    setSelectedPatty(null);
    setToppingQuantities({});
  }

  const handlePattySelection = (pattyId: string) => {
    setSelectedPatty({ id: pattyId, quantity: 1 });
  };
  
  const handlePattyQuantityChange = (change: 1 | -1) => {
    if (selectedPatty) {
      const newQuantity = Math.max(1, selectedPatty.quantity + change);
      setSelectedPatty({ ...selectedPatty, quantity: newQuantity });
    }
  };

  const handleToppingQuantityChange = (toppingId: string, change: 1 | -1) => {
    setToppingQuantities(prev => {
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
      toast({ title: 'Missing Name', description: "Please enter a name for the person this burger is for.", variant: 'destructive'});
      return;
    }
    const bun = buns.find(b => b.id === selectedBunId);
    if (!bun) {
      toast({ title: 'Missing Bun', description: 'Please select a bun for the burger.', variant: 'destructive'});
      return;
    }
    const pattyInfo = patties.find(p => p.id === selectedPatty?.id);
    if (!pattyInfo || !selectedPatty) {
      toast({ title: 'Missing Patty', description: 'Please select a patty and quantity.', variant: 'destructive'});
      return;
    }

    const newBurger: Burger = {
      id: Date.now().toString(),
      personName: personName.trim(),
      bun,
      patty: { ...pattyInfo, quantity: selectedPatty.quantity },
      toppings: Object.entries(toppingQuantities)
        .map(([id, quantity]) => {
          const toppingInfo = toppings.find(t => t.id === id)!;
          return { ...toppingInfo, quantity };
        }),
    };

    addBurger(newBurger);
    toast({ title: 'Burger Added!', description: `Burger for ${newBurger.personName} added to the order.` });
    resetForm();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl"><Sandwich className="h-6 w-6 text-primary" />Create a Burger</CardTitle>
        <CardDescription>Assemble a burger by choosing a bun, patty, and toppings.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateAndAddAnotherBurger} className="space-y-6">
          <div>
            <Label htmlFor="personName" className="flex items-center gap-2 mb-2 font-medium"><UserCircle className="h-5 w-5 text-muted-foreground" />Burger For (Name):</Label>
            <Input id="personName" type="text" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="e.g., Jane Doe" />
          </div>

          <ScrollArea className="h-[calc(100vh-30rem)] space-y-6 pr-4">
            {/* Buns Section */}
            <div>
              <Label className="flex items-center gap-2 mb-2 font-medium"><Wheat className="h-5 w-5 text-muted-foreground" />Choose a Bun</Label>
              <RadioGroup value={selectedBunId ?? undefined} onValueChange={setSelectedBunId} className="grid grid-cols-2 gap-2">
                {buns.map(bun => (
                  <Label key={bun.id} htmlFor={bun.id} className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground has-[input:checked]:border-ring">
                    <RadioGroupItem value={bun.id} id={bun.id} />
                    <span>{bun.name}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Patties Section */}
            <div>
              <Label className="flex items-center gap-2 mb-2 font-medium"><Beef className="h-5 w-5 text-muted-foreground" />Choose a Patty</Label>
              <div className="grid grid-cols-2 gap-2">
                <RadioGroup value={selectedPatty?.id ?? undefined} onValueChange={handlePattySelection} className="contents">
                  {patties.map(patty => (
                    <Label key={patty.id} htmlFor={patty.id} className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground has-[input:checked]:border-ring">
                      <RadioGroupItem value={patty.id} id={patty.id} />
                      <span>{patty.name}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
              {selectedPatty && (
                <div className="flex items-center gap-2 mt-2 justify-center p-2 border rounded-md max-w-xs mx-auto">
                  <span className="font-medium">Quantity:</span>
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handlePattyQuantityChange(-1)}><Minus className="h-4 w-4" /></Button>
                  <span className="w-8 text-center font-medium text-lg">{selectedPatty.quantity}</span>
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handlePattyQuantityChange(1)}><Plus className="h-4 w-4" /></Button>
                </div>
              )}
            </div>

            {/* Toppings Section */}
            <div>
              <Label className="flex items-center gap-2 mb-2 font-medium"><Carrot className="h-5 w-5 text-muted-foreground" />Add Toppings</Label>
              <div className="space-y-3 rounded-md border p-3 shadow-inner bg-background/50">
                {toppings.map((topping) => (
                  <div key={topping.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30">
                    <Label htmlFor={`topping-qty-${topping.id}`} className="font-normal">{topping.name}</Label>
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handleToppingQuantityChange(topping.id, -1)}><Minus className="h-4 w-4" /></Button>
                      <span id={`topping-qty-${topping.id}`} className="w-8 text-center font-medium text-lg">{toppingQuantities[topping.id] || 0}</span>
                      <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => handleToppingQuantityChange(topping.id, 1)}><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
          
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3">
            <Sandwich className="mr-2 h-5 w-5" /> Add This Burger to Order
          </Button>
        </form>
      </CardContent>
      <CardFooter className="pt-6 flex flex-col sm:flex-row justify-between gap-3">
        <Button variant="outline" onClick={onGoBack} className="w-full sm:w-auto"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Ingredients</Button>
        <Button onClick={onOrderReady} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">Order Ready <PackageCheck className="ml-2 h-4 w-4" /></Button>
      </CardFooter>
    </Card>
  );
};

export default BurgerCreator;
