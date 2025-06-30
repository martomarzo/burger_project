"use client";

import type { Burger } from '@/lib/types';
import React from 'react';
import BurgerCard from './BurgerCard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ListChecks, RotateCcw, PlusCircle } from 'lucide-react';
import Image from 'next/image';

interface BurgerListProps {
  burgers: Burger[];
  removeBurger: (burgerId: string) => void;
  onStartNewOrder: () => void;
  onAddAnotherBurger: () => void;
}

const BurgerList: React.FC<BurgerListProps> = ({ burgers, removeBurger, onStartNewOrder, onAddAnotherBurger }) => {
  return (
    <Card className="shadow-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl flex-wrap gap-y-2">
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            Current Burger Orders
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onAddAnotherBurger} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Burger
            </Button>
            <Button variant="default" onClick={onStartNewOrder} size="sm">
                <RotateCcw className="mr-2 h-4 w-4" /> Start New Order
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {burgers.length > 0 
            ? "All the delicious burgers in the current order." 
            : "This order is currently empty. Add some burgers or start a new order."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        {burgers.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center">
            <Image 
              src="https://placehold.co/300x200.png"
              alt="Empty plate with a single burger icon" 
              width={300} 
              height={200} 
              className="rounded-lg mb-4 shadow-md"
              data-ai-hint="empty plate"
            />
            <p className="text-muted-foreground text-lg">No burgers in this order yet.</p>
            <p className="text-sm text-muted-foreground">Click "Start New Order" or "Add Another Burger" above to begin.</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-22rem)] lg:h-[calc(100vh-20rem)] pr-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {burgers.map((burger) => (
                <BurgerCard key={burger.id} burger={burger} onRemove={removeBurger} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      {burgers.length > 0 && (
        <CardFooter className="pt-4">
            <p className="text-xs text-muted-foreground">Total burgers in this order: {burgers.length}</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default BurgerList;
