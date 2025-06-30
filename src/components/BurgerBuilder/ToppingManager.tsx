"use client";

import type { Ingredient } from '@/lib/types';
import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, ArrowRight, Wheat, Carrot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import PattyIcon from './PattyIcon';

interface IngredientManagerProps {
  availableIngredients: Ingredient[];
  setAvailableIngredients: (ingredients: Ingredient[] | ((prev: Ingredient[]) => Ingredient[])) => void;
  onNext: () => void;
}

const IngredientManager: React.FC<IngredientManagerProps> = ({ availableIngredients, setAvailableIngredients, onNext }) => {
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientCategory, setNewIngredientCategory] = useState<'bun' | 'patty' | 'topping'>('topping');
  const { toast } = useToast();

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) {
      toast({ title: 'Error', description: 'Ingredient name cannot be empty.', variant: 'destructive' });
      return;
    }
    if (availableIngredients.some(i => i.name.toLowerCase() === newIngredientName.trim().toLowerCase())) {
      toast({ title: 'Error', description: `Ingredient "${newIngredientName.trim()}" already exists.`, variant: 'destructive' });
      return;
    }

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: newIngredientName.trim(),
      category: newIngredientCategory,
    };
    setAvailableIngredients(prev => [...prev, newIngredient].sort((a, b) => a.category.localeCompare(b.category)));
    setNewIngredientName('');
    toast({ title: 'Success!', description: `Ingredient "${newIngredient.name}" added to ${newIngredient.category}s.` });
  };

  const handleDeleteIngredient = (ingredientId: string) => {
    const ingredientToDelete = availableIngredients.find(i => i.id === ingredientId);
    setAvailableIngredients(prev => prev.filter(i => i.id !== ingredientId));
    if (ingredientToDelete) {
      toast({ title: 'Ingredient Removed', description: `"${ingredientToDelete.name}" has been removed.`, variant: 'destructive' });
    }
  };

  const groupedIngredients = useMemo(() => {
    return availableIngredients.reduce((acc, ingredient) => {
      (acc[ingredient.category] = acc[ingredient.category] || []).push(ingredient);
      return acc;
    }, {} as Record<Ingredient['category'], Ingredient[]>);
  }, [availableIngredients]);

  const categoryIcons = {
    bun: <Wheat className="h-5 w-5 mr-2" />,
    patty: <PattyIcon className="h-5 w-5 mr-2" />,
    topping: <Carrot className="h-5 w-5 mr-2" />,
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <PlusCircle className="h-6 w-6 text-primary" />
          Manage Ingredients
        </CardTitle>
        <CardDescription>Add ingredients to their categories. You need at least one of each to continue.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddIngredient} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              placeholder="Enter ingredient name"
              aria-label="New ingredient name"
              className="flex-grow"
            />
            <Select onValueChange={(value: any) => setNewIngredientCategory(value)} defaultValue="topping">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bun">Bun</SelectItem>
                <SelectItem value="patty">Patty</SelectItem>
                <SelectItem value="topping">Topping</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" variant="default" size="icon" aria-label="Add ingredient" className="w-full sm:w-auto">
              <PlusCircle />
            </Button>
          </div>
        </form>
        <ScrollArea className="mt-6 h-[calc(100vh-28rem)]">
          {Object.keys(groupedIngredients).length === 0 ? (
            <p className="text-sm text-center py-8 text-muted-foreground">No ingredients added yet. Add some above!</p>
          ) : (
            <div className="space-y-6">
              {(['bun', 'patty', 'topping'] as const).map(category =>
                groupedIngredients[category]?.length > 0 && (
                  <div key={category}>
                    <h4 className="font-medium text-md text-foreground/80 mb-2 flex items-center capitalize">
                      {categoryIcons[category]} {category}s
                    </h4>
                    <ul className="space-y-2 rounded-md border p-2 shadow-inner bg-background/50">
                      {groupedIngredients[category].map((ingredient) => (
                        <li key={ingredient.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors duration-150">
                          <Badge variant="secondary" className="text-sm">{ingredient.name}</Badge>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteIngredient(ingredient.id)} aria-label={`Delete ${ingredient.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-6">
        <Button onClick={onNext} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3">
          Next: Create Burgers <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IngredientManager;
