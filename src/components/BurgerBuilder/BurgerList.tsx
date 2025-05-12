"use client";

import type { Burger } from '@/lib/types';
import React from 'react';
import BurgerCard from './BurgerCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks } from 'lucide-react';
import Image from 'next/image';

interface BurgerListProps {
  burgers: Burger[];
  removeBurger: (burgerId: string) => void;
}

const BurgerList: React.FC<BurgerListProps> = ({ burgers, removeBurger }) => {
  return (
    <Card className="shadow-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ListChecks className="h-6 w-6 text-primary" />
          Current Burger Orders
        </CardTitle>
        <CardDescription>All the delicious burgers waiting to be made.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        {burgers.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center">
            <Image 
              src="https://picsum.photos/seed/emptyplate/300/200" 
              alt="Empty plate" 
              width={300} 
              height={200} 
              className="rounded-lg mb-4 shadow-md"
              data-ai-hint="empty plate"
            />
            <p className="text-muted-foreground text-lg">No burgers created yet.</p>
            <p className="text-sm text-muted-foreground">Time to build some masterpieces!</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-18rem)] pr-3"> {/* Adjusted height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4"> {/* Adjusted grid for larger cards */}
              {burgers.map((burger) => (
                <BurgerCard key={burger.id} burger={burger} onRemove={removeBurger} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default BurgerList;
