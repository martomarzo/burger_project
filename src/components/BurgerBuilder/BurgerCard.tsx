"use client";

import type { Burger } from '@/lib/types';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sandwich, Trash2, User } from 'lucide-react';

interface BurgerCardProps {
  burger: Burger;
  onRemove: (burgerId: string) => void;
}

const getToppingBadgeVariant = (toppingName: string): "default" | "secondary" | "destructive" | "outline" => {
  const lowerName = toppingName.toLowerCase();
  if (lowerName.includes('cheese') || lowerName.includes('onion')) return 'secondary'; // Yellow-ish
  if (lowerName.includes('tomato') || lowerName.includes('bacon') || lowerName.includes('pepperoni')) return 'destructive'; // Red-ish
  if (lowerName.includes('lettuce') || lowerName.includes('pickle') || lowerName.includes('avocado')) return 'default'; // Primary (Earthy brown) or another theme color
  return 'outline';
}

const BurgerCard: React.FC<BurgerCardProps> = ({ burger, onRemove }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sandwich className="h-6 w-6 text-primary" />
            Burger Order
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/80"
            onClick={() => onRemove(burger.id)}
            aria-label={`Remove ${burger.personName}'s burger`}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        <CardDescription className="flex items-center gap-1 pt-1">
          <User className="h-4 w-4 text-muted-foreground" />
          For: <span className="font-semibold text-foreground">{burger.personName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="text-sm font-medium mb-2 text-foreground/90">Selected Toppings:</h4>
        {burger.toppings.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {burger.toppings.map((topping) => (
              <Badge key={topping.id} variant={getToppingBadgeVariant(topping.name)} className="px-3 py-1 text-sm flex items-center">
                {topping.name}
                {topping.quantity > 1 && <span className="ml-1.5 opacity-80 text-xs font-semibold">(x{topping.quantity})</span>}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Plain burger (no toppings).</p>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Order ID: {burger.id}</p>
      </CardFooter>
    </Card>
  );
};

export default BurgerCard;
