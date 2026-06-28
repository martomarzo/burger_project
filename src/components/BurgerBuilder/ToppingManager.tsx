"use client";

import type { Ingredient } from '@/lib/types';
import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, ArrowRight, Wheat, Carrot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PattyIcon from './PattyIcon';

interface IngredientManagerProps {
  availableIngredients: Ingredient[];
  setAvailableIngredients: (ingredients: Ingredient[] | ((prev: Ingredient[]) => Ingredient[])) => void;
  onNext: () => void;
}

const IngredientManager: React.FC<IngredientManagerProps> = ({ availableIngredients, setAvailableIngredients, onNext }) => {
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientCategory, setNewIngredientCategory] = useState<'bun' | 'patty' | 'topping'>('topping');
  const [newIngredientAmount, setNewIngredientAmount] = useState('');
  const { toast } = useToast();

  // Parse a stock-amount input: blank means unlimited; 0 hides the item; otherwise a positive integer.
  const parseAmount = (raw: string): { amount?: number; error?: string } => {
    const trimmed = raw.trim();
    if (trimmed === '') return { amount: undefined };
    const n = Number(trimmed);
    if (!Number.isInteger(n) || n < 0) return { error: 'Amount must be a whole number of 0 or more (leave blank for unlimited).' };
    return { amount: n };
  };

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
    const { amount, error } = parseAmount(newIngredientAmount);
    if (error) {
      toast({ title: 'Invalid Amount', description: error, variant: 'destructive' });
      return;
    }

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: newIngredientName.trim(),
      category: newIngredientCategory,
      ...(amount !== undefined ? { amount } : {}),
    };
    setAvailableIngredients(prev => [...prev, newIngredient].sort((a, b) => a.category.localeCompare(b.category)));
    setNewIngredientName('');
    setNewIngredientAmount('');
    toast({
      title: 'Success!',
      description: `Ingredient "${newIngredient.name}" added to ${newIngredient.category}s${amount !== undefined ? ` (${amount} in stock)` : ''}.`,
    });
  };

  // Edit stock for an existing ingredient: blank clears the limit (unlimited); 0 hides it.
  const updateIngredientAmount = (ingredientId: string, raw: string) => {
    const trimmed = raw.trim();
    const next = trimmed === '' ? undefined : Math.max(0, Math.floor(Number(trimmed) || 0));
    setAvailableIngredients(prev =>
      prev.map(i => {
        if (i.id !== ingredientId) return i;
        const updated = { ...i };
        if (next === undefined) delete updated.amount;
        else updated.amount = next;
        return updated;
      })
    );
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
            <Input
              type="number"
              min={0}
              value={newIngredientAmount}
              onChange={(e) => setNewIngredientAmount(e.target.value)}
              placeholder="Qty (∞)"
              aria-label="Stock amount (leave blank for unlimited)"
              className="w-full sm:w-[120px]"
            />
            <Button type="submit" variant="default" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Set a stock amount to limit how many can be used (e.g. 2 brioche buns). Use <strong>0</strong> to hide an item, or leave blank for unlimited (∞).
          </p>
        </form>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(['bun', 'patty', 'topping'] as const).map(category => {
            const items = groupedIngredients[category] ?? [];
            return (
              <div key={category} className="rounded-lg border bg-background/50 p-3 shadow-inner">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="flex items-center font-medium capitalize text-foreground/80">
                    {categoryIcons[category]} {category}s
                  </h4>
                  <Badge variant="outline" className="tabular-nums">{items.length}</Badge>
                </div>
                {items.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No {category}s yet.</p>
                ) : (
                  <ul className="space-y-1.5 lg:max-h-[60dvh] lg:overflow-y-auto lg:pr-1">
                    {items.map((ingredient) => {
                      const hidden = ingredient.amount === 0;
                      return (
                        <li
                          key={ingredient.id}
                          className={cn(
                            'flex items-center gap-2 rounded-md p-1.5 hover:bg-muted/40 transition-colors',
                            hidden && 'opacity-60'
                          )}
                        >
                          <span className="flex-grow truncate text-sm font-medium">
                            {ingredient.name}
                            {hidden && <span className="ml-2 text-xs font-normal text-destructive">hidden</span>}
                          </span>
                          <Input
                            id={`amount-${ingredient.id}`}
                            type="number"
                            min={0}
                            value={ingredient.amount ?? ''}
                            onChange={(e) => updateIngredientAmount(ingredient.id, e.target.value)}
                            placeholder="∞"
                            aria-label={`Stock amount for ${ingredient.name} (blank for unlimited, 0 to hide)`}
                            className="h-9 w-16"
                          />
                          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-destructive hover:text-destructive/80" onClick={() => handleDeleteIngredient(ingredient.id)} aria-label={`Delete ${ingredient.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="pt-6">
        <Button onClick={onNext} size="lg" className="w-full text-base h-12">
          Next: Create Burgers <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IngredientManager;
