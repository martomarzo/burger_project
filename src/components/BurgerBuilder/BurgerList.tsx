"use client";

import type { Burger } from '@/lib/types';
import React from 'react';
import BurgerCard from './BurgerCard';
import BurgerIcon from './BurgerIcon';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListChecks, RotateCcw, PlusCircle } from 'lucide-react';

interface BurgerListProps {
  burgers: Burger[];
  removeBurger: (burgerId: string) => void;
  onStartNewOrder: () => void;
  onAddAnotherBurger: () => void;
}

const BurgerList: React.FC<BurgerListProps> = ({ burgers, removeBurger, onStartNewOrder, onAddAnotherBurger }) => {
  return (
    <Card className="shadow-xl flex flex-col">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ListChecks className="h-6 w-6 text-primary" />
            Current Burger Orders
          </CardTitle>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <Button variant="outline" onClick={onAddAnotherBurger} className="h-11 sm:h-10">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Burger
            </Button>
            <Button variant="default" onClick={onStartNewOrder} className="h-11 sm:h-10">
              <RotateCcw className="mr-2 h-4 w-4" /> New Order
            </Button>
          </div>
        </div>
        <CardDescription>
          {burgers.length > 0
            ? "All the delicious burgers in the current order."
            : "This order is currently empty. Add some burgers or start a new order."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {burgers.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-muted/50">
              <BurgerIcon className="h-14 w-14 text-primary/70" />
            </div>
            <p className="text-muted-foreground text-lg">No burgers in this order yet.</p>
            <p className="text-sm text-muted-foreground">Tap &ldquo;Add Burger&rdquo; or &ldquo;New Order&rdquo; above to begin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {burgers.map((burger) => (
              <BurgerCard key={burger.id} burger={burger} onRemove={removeBurger} />
            ))}
          </div>
        )}
      </CardContent>
      {burgers.length > 0 && (
        <CardFooter className="pt-4">
          <p className="text-sm text-muted-foreground">Total burgers in this order: {burgers.length}</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default BurgerList;
