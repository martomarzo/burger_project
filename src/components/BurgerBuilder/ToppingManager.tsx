"use client";

import type { Topping } from '@/lib/types';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ToppingManagerProps {
  availableToppings: Topping[];
  setAvailableToppings: (toppings: Topping[] | ((prev: Topping[]) => Topping[])) => void;
}

const ToppingManager: React.FC<ToppingManagerProps> = ({ availableToppings, setAvailableToppings }) => {
  const [newToppingName, setNewToppingName] = useState('');
  const { toast } = useToast();

  const handleAddTapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToppingName.trim()) {
      toast({
        title: 'Error',
        description: 'Topping name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    if (availableToppings.some(t => t.name.toLowerCase() === newToppingName.trim().toLowerCase())) {
      toast({
        title: 'Error',
        description: `Topping "${newToppingName.trim()}" already exists.`,
        variant: 'destructive',
      });
      return;
    }

    const newTopping: Topping = {
      id: Date.now().toString(),
      name: newToppingName.trim(),
    };
    setAvailableToppings(prev => [...prev, newTopping]);
    setNewToppingName('');
    toast({
      title: 'Success!',
      description: `Topping "${newTopping.name}" added.`,
    });
  };

  const handleDeleteTopping = (toppingId: string) => {
    const toppingToDelete = availableToppings.find(t => t.id === toppingId);
    setAvailableToppings(prev => prev.filter(t => t.id !== toppingId));
    if (toppingToDelete) {
      toast({
        title: 'Topping Removed',
        description: `Topping "${toppingToDelete.name}" has been removed.`,
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <PlusCircle className="h-6 w-6 text-primary" />
          Manage Toppings
        </CardTitle>
        <CardDescription>Add or remove available burger toppings.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTapping} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newToppingName}
              onChange={(e) => setNewToppingName(e.target.value)}
              placeholder="Enter topping name (e.g., Cheese)"
              aria-label="New topping name"
            />
            <Button type="submit" variant="default" size="icon" aria-label="Add topping">
              <PlusCircle />
            </Button>
          </div>
        </form>
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-md text-foreground/80">Available Toppings:</h4>
          {availableToppings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No toppings added yet. Add some above!</p>
          ) : (
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {availableToppings.map((topping) => (
                <li key={topping.id} className="flex items-center justify-between p-2 bg-background rounded-md shadow-sm hover:bg-muted/50 transition-colors duration-150">
                  <Badge variant="secondary" className="text-sm">{topping.name}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => handleDeleteTopping(topping.id)}
                    aria-label={`Delete ${topping.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ToppingManager;
