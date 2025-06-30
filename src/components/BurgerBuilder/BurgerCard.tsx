"use client";

import type { Burger } from '@/lib/types';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Wheat, Carrot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import PattyIcon from './PattyIcon';
import BurgerIcon from './BurgerIcon';

interface BurgerCardProps {
  burger: Burger;
  onRemove: (burgerId: string) => void;
}

const getToppingBadgeVariant = (toppingName: string): "default" | "secondary" | "destructive" | "outline" => {
  const lowerName = toppingName.toLowerCase();
  if (lowerName.includes('cheese') || lowerName.includes('onion')) return 'secondary';
  if (lowerName.includes('tomato') || lowerName.includes('bacon') || lowerName.includes('pepperoni')) return 'destructive';
  if (lowerName.includes('lettuce') || lowerName.includes('pickle') || lowerName.includes('avocado')) return 'default';
  return 'outline';
}

const BurgerCard: React.FC<BurgerCardProps> = ({ burger, onRemove }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <BurgerIcon className="h-6 w-6 text-primary" />
            {burger.personName}'s Burger Order
          </CardTitle>
          <Button variant="ghost" size="icon" className="text-primary hover:text-primary/90" onClick={() => onRemove(burger.id)} aria-label={`Mark ${burger.personName}'s burger as delivered`}>
            <CheckCircle2 className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        {/* Bun */}
        <div className="flex items-center gap-2">
          <Wheat className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Bun:</span>
          <span className="text-sm">{burger.bun.name}</span>
        </div>

        {/* Patty */}
        <div className="flex items-center gap-2">
          <PattyIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Patty:</span>
          <span className="text-sm">{burger.patty.name}</span>
          {burger.patty.quantity > 1 && <Badge variant="outline">x{burger.patty.quantity}</Badge>}
        </div>
        
        <Separator />

        {/* Toppings */}
        <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Carrot className="h-4 w-4 text-muted-foreground" />
                Toppings:
            </h4>
            {burger.toppings.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {burger.toppings.map((topping) => (
                <Badge key={topping.id} variant={getToppingBadgeVariant(topping.name)} className="px-3 py-1 text-sm">
                    {topping.name}
                    {topping.quantity > 1 && <span className="ml-1.5 opacity-80 text-xs font-semibold">(x{topping.quantity})</span>}
                </Badge>
                ))}
            </div>
            ) : (
            <p className="text-sm text-muted-foreground">No extra toppings.</p>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">Order ID: {burger.id}</p>
      </CardFooter>
    </Card>
  );
};

export default BurgerCard;
