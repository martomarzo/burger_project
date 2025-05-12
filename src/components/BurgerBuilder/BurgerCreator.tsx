"use client";

import type { Topping, Burger } from '@/lib/types';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sandwich, UserCircle, ArrowLeft, PackageCheck } from 'lucide-react';
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
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const { toast } = useToast();

  const handleToppingChange = (topping: Topping, checked: boolean) => {
    setSelectedToppings(prev =>
      checked ? [...prev, topping] : prev.filter(t => t.id !== topping.id)
    );
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
    if (selectedToppings.length === 0) {
      toast({
        title: 'No Toppings Selected',
        description: 'A burger must have at least one topping. Please select toppings.',
        variant: 'destructive',
      });
      return;
    }

    const newBurger: Burger = {
      id: Date.now().toString(),
      personName: personName.trim(),
      toppings: selectedToppings,
    };

    addBurger(newBurger);
    
    toast({
      title: 'Burger Added!',
      description: `Burger for ${newBurger.personName} added to the order. Add another or finalize order.`,
    });

    // Reset form for next burger
    setPersonName('');
    setSelectedToppings([]);
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
              <ScrollArea className="h-48 rounded-md border p-3 shadow-inner bg-background/50">
                <div className="space-y-3">
                  {availableToppings.map((topping) => (
                    <div key={topping.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/30 transition-colors duration-150">
                      <Checkbox
                        id={`topping-${topping.id}`}
                        checked={selectedToppings.some(st => st.id === topping.id)}
                        onCheckedChange={(checked) => handleToppingChange(topping, !!checked)}
                        aria-labelledby={`label-topping-${topping.id}`}
                      />
                      <Label htmlFor={`topping-${topping.id}`} id={`label-topping-${topping.id}`} className="text-sm font-normal cursor-pointer">
                        {topping.name}
                      </Label>
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
